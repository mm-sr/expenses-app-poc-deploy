'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Label } from 'recharts';
import { Category, Expense } from '@/lib/types';
import { formatCurrency, calculatePercentage } from '@/lib/utils';

// Default props for axes to avoid warnings
const axisProps = {
  scale: 'auto',
  tickLine: false,
  axisLine: false
};

interface CategoryBreakdownProps {
  expenses: Expense[];
  categories: Category[];
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return percent > 0.05 ? (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  ) : null;
};

export function CategoryBreakdown({ expenses, categories }: CategoryBreakdownProps) {
  const getCategoryData = () => {
    const categoryTotals = new Map<string, number>();
    
    expenses.forEach(expense => {
      const current = categoryTotals.get(expense.categoryId) || 0;
      categoryTotals.set(expense.categoryId, current + expense.amount);
    });

    return Array.from(categoryTotals.entries())
      .map(([categoryId, amount]) => {
        const category = categories.find(c => c.id === categoryId);
        return {
          name: category?.name || 'Uncategorized',
          value: amount,
          color: category?.color || 'hsl(var(--muted))',
        };
      })
      .sort((a, b) => b.value - a.value);
  };

  const data = getCategoryData();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{data.name}</p>
          <p className="text-muted-foreground">{formatCurrency(data.value)}</p>
          <p className="text-sm text-muted-foreground">
            {calculatePercentage(data.value, total)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            {...axisProps}
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={2}
            label={renderCustomizedLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
            <Label
              value={`Total\n${formatCurrency(total)}`}
              position="center"
              className="text-lg font-medium"
            />
          </Pie>
          <Tooltip 
            content={<CustomTooltip />}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            formatter={(value, entry: any) => (
              <span className="text-sm">
                {value} ({calculatePercentage(entry.payload.value, total)}%)
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}