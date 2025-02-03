import React, { useState, useEffect } from 'react';
import { useTimelineEvents } from '@/hooks/use-timeline-events';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { toast } from 'sonner';
import ExpenseCard from './budget/ExpenseCard';
import CurrencySelector from './budget/CurrencySelector';
import ExpenseDetails from './budget/ExpenseDetails';
import AddExpenseDialog from './budget/AddExpenseDialog';
import TotalExpenseCard from './budget/TotalExpenseCard';
import { useQueryClient } from '@tanstack/react-query';

interface BudgetViewProps {
  tripId: string | undefined;
}

const BudgetView: React.FC<BudgetViewProps> = ({ tripId }) => {
  const queryClient = useQueryClient();
  const { events } = useTimelineEvents(tripId);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    const fetchExchangeRates = async () => {
      const usedCurrencies = new Set<string>();
      events?.forEach(event => {
        if (event.expense_currency) usedCurrencies.add(event.expense_currency);
        event.activities?.forEach(activity => {
          if (activity.currency) usedCurrencies.add(activity.currency);
        });
      });

      const { data, error } = await supabase
        .from('exchange_rates')
        .select('*')
        .in('currency_from', Array.from(usedCurrencies))
        .eq('currency_to', selectedCurrency);

      if (error) {
        console.error('Error fetching exchange rates:', error);
      } else if (data && data.length > 0) {
        setExchangeRates(data);
        setLastUpdated(data[0].last_updated);
      }
    };

    fetchExchangeRates();
  }, [events, selectedCurrency]);

  const handleDeleteExpense = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('timeline_events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      toast.success('Expense deleted successfully');
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  const convertAmount = (amount: number, fromCurrency: string) => {
    if (fromCurrency === selectedCurrency) return amount;
    const rate = exchangeRates.find(r => r.currency_from === fromCurrency)?.rate || 1;
    return amount * rate;
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleUpdateCost = async (eventId: string, cost: number, currency: string) => {
    try {
      const { error } = await supabase
        .from('timeline_events')
        .update({ 
          expense_cost: cost,
          expense_currency: currency
        })
        .eq('id', eventId);

      if (error) throw error;
      toast.success('Cost updated successfully');
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating cost:', error);
      toast.error('Failed to update cost');
    }
  };

  const handleAddExpense = async (
    category: string,
    title: string,
    amount: number,
    currency: string,
    isPaid: boolean,
    date: string | null
  ) => {
    try {
      if (!tripId) throw new Error('No trip ID provided');
      
      const { data, error } = await supabase
        .from('timeline_events')
        .insert([{
          trip_id: tripId,
          title: title,
          date: date || format(new Date(), 'yyyy-MM-dd'),
          order_index: events?.length || 0,
          expense_type: category.toLowerCase(),
          expense_cost: amount,
          expense_currency: currency,
          expense_paid: isPaid,
          expense_date: date
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Expense added successfully');
      setIsAddExpenseOpen(false);
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('Failed to add expense');
    }
  };

  const calculateTotals = () => {
    let accommodationTotal = 0;
    let transportationTotal = 0;
    let activitiesTotal = 0;
    let otherTotal = 0;

    events?.forEach(event => {
      if (event.expense_cost && event.expense_currency) {
        const convertedAmount = convertAmount(Number(event.expense_cost), event.expense_currency);
        switch (event.expense_type) {
          case 'accommodation':
            accommodationTotal += convertedAmount;
            break;
          case 'transportation':
            transportationTotal += convertedAmount;
            break;
          case 'activities':
            activitiesTotal += convertedAmount;
            break;
          case 'other':
            otherTotal += convertedAmount;
            break;
        }
      }

      if (event.activities && event.activities.length > 0) {
        event.activities.forEach(activity => {
          if (activity.cost && activity.currency) {
            const convertedActivityAmount = convertAmount(Number(activity.cost), activity.currency);
            activitiesTotal += convertedActivityAmount;
          }
        });
      }
    });

    const total = accommodationTotal + transportationTotal + activitiesTotal + otherTotal;
    
    return {
      accommodation: accommodationTotal,
      transportation: transportationTotal,
      activities: activitiesTotal,
      other: otherTotal,
      total: total
    };
  };

  const getExpensesByType = (type: string) => {
    return events?.filter(event => 
      event.expense_type === type && event.expense_cost && event.expense_currency
    ) || [];
  };

  const handleAddExpenseClick = (category: string) => {
    setSelectedCategory(category);
    setIsAddExpenseOpen(true);
  };

  useEffect(() => {
    // Set up real-time subscription for timeline_events table
    const channel = supabase
      .channel('timeline-events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'timeline_events',
          filter: `trip_id=eq.${tripId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['timeline-events', tripId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tripId, queryClient]);

  const totals = calculateTotals();

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-earth-500">Trip Budget</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Display in:</span>
            <CurrencySelector
              value={selectedCurrency}
              onValueChange={setSelectedCurrency}
              className="w-[100px]"
            />
          </div>
        </div>
        {lastUpdated && (
          <p className="text-sm text-gray-500">
            Exchange rates last updated: {format(new Date(lastUpdated), 'PPpp')}
          </p>
        )}
      </div>

      <div className="flex flex-col space-y-4">
        <ExpenseCard
          title="Accommodation"
          amount={totals.accommodation}
          currency={selectedCurrency}
          isExpanded={expandedSections.includes('accommodation')}
          onToggle={() => toggleSection('accommodation')}
          onAddExpense={() => handleAddExpenseClick('accommodation')}
        >
          {getExpensesByType('accommodation').map(event => (
            <ExpenseDetails
              key={event.id}
              id={event.id}
              cost={event.expense_cost}
              currency={event.expense_currency}
              description={`${event.expense_date || event.date} - ${event.title}`}
              isEditing={editingItem === event.id}
              onEdit={() => setEditingItem(event.id)}
              onSave={(cost, currency) => handleUpdateCost(event.id, cost, currency)}
              onDelete={() => handleDeleteExpense(event.id)}
            />
          ))}
        </ExpenseCard>

        <ExpenseCard
          title="Transportation"
          amount={totals.transportation}
          currency={selectedCurrency}
          isExpanded={expandedSections.includes('transportation')}
          onToggle={() => toggleSection('transportation')}
          onAddExpense={() => handleAddExpenseClick('transportation')}
        >
          {getExpensesByType('transportation').map(event => (
            <ExpenseDetails
              key={event.id}
              id={event.id}
              cost={event.expense_cost}
              currency={event.expense_currency}
              description={`${event.expense_date || event.date} - ${event.title}`}
              isEditing={editingItem === event.id}
              onEdit={() => setEditingItem(event.id)}
              onSave={(cost, currency) => handleUpdateCost(event.id, cost, currency)}
              onDelete={() => handleDeleteExpense(event.id)}
            />
          ))}
        </ExpenseCard>

        <ExpenseCard
          title="Activities"
          amount={totals.activities}
          currency={selectedCurrency}
          isExpanded={expandedSections.includes('activities')}
          onToggle={() => toggleSection('activities')}
          onAddExpense={() => handleAddExpenseClick('activities')}
        >
          {getExpensesByType('activities').map(event => (
            <ExpenseDetails
              key={event.id}
              id={event.id}
              cost={event.expense_cost}
              currency={event.expense_currency}
              description={`${event.expense_date || event.date} - ${event.title}`}
              isEditing={editingItem === event.id}
              onEdit={() => setEditingItem(event.id)}
              onSave={(cost, currency) => handleUpdateCost(event.id, cost, currency)}
              onDelete={() => handleDeleteExpense(event.id)}
            />
          ))}
          {events?.map(event => 
            event.activities?.map(activity => (
              <ExpenseDetails
                key={activity.id}
                id={activity.id}
                cost={activity.cost}
                currency={activity.currency}
                description={activity.text}
                isEditing={editingItem === activity.id}
                onEdit={() => setEditingItem(activity.id)}
                onSave={(cost, currency) => handleUpdateCost(activity.id, cost, currency)}
                onDelete={() => handleDeleteExpense(activity.id)}
              />
            ))
          )}
        </ExpenseCard>

        <TotalExpenseCard total={totals.total} currency={selectedCurrency} />
      </div>

      <AddExpenseDialog 
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        onSubmit={handleAddExpense}
        defaultCategory={selectedCategory}
      />
    </div>
  );
};

export default BudgetView;