'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import {
  Wallet,
  TrendingUp,
  PieChart,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Calendar,
  DollarSign,
  Tag,
  ChevronLeft,
  ChevronRight,
  PiggyBank,
  Target,
  Download,
  LogOut,
  User,
  Lock,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Progress } from '@/components/ui/progress';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// Types
interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  category: Category;
}

interface Saving {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string | null;
}

interface User {
  id: string;
  email: string;
  name: string | null;
}

interface ExpenseFormData {
  amount: number;
  description: string;
  date: string;
  categoryId: string;
}

interface SavingFormData {
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
}

// Auth Component
function AuthScreen({ onLogin }: { onLogin: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          toast.success('Logged in successfully!');
          onLogin();
        } else {
          const data = await response.json();
          toast.error(data.error || 'Invalid credentials');
        }
      } else {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, name }),
        });

        if (response.ok) {
          toast.success('Account created! Please sign in.');
          setIsLogin(true);
          setPassword('');
        } else {
          const data = await response.json();
          toast.error(data.error || 'Failed to create account');
        }
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Expense Tracker
          </CardTitle>
          <CardDescription>
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </span>{' '}
            <Button variant="link" className="p-0" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Summary Card Component
function SummaryCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn('rounded-full p-2', color)}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

// Expense Form Component
function ExpenseForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  categories,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseFormData) => void;
  initialData?: Expense | null;
  categories: Category[];
}) {
  const getInitialFormData = (): ExpenseFormData => {
    if (initialData) {
      return {
        amount: initialData.amount,
        description: initialData.description,
        date: format(new Date(initialData.date), 'yyyy-MM-dd'),
        categoryId: initialData.categoryId,
      };
    }
    return {
      amount: 0,
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      categoryId: categories[0]?.id || '',
    };
  };

  const [formData, setFormData] = useState<ExpenseFormData>(getInitialFormData);

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setFormData(getInitialFormData());
    });
    return () => cancelAnimationFrame(timer);
  }, [isOpen, initialData?.id, categories.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the details of your expense.' : 'Enter the details of your new expense.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount || ''}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What did you spend on?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {initialData ? 'Update' : 'Add'} Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Saving Form Component
function SavingForm({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SavingFormData) => void;
  initialData?: Saving | null;
}) {
  const [formData, setFormData] = useState<SavingFormData>({
    title: '',
    targetAmount: 0,
    currentAmount: 0,
    targetDate: '',
  });

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      if (initialData) {
        setFormData({
          title: initialData.title,
          targetAmount: initialData.targetAmount,
          currentAmount: initialData.currentAmount,
          targetDate: initialData.targetDate ? format(new Date(initialData.targetDate), 'yyyy-MM-dd') : '',
        });
      } else {
        setFormData({
          title: '',
          targetAmount: 0,
          currentAmount: 0,
          targetDate: '',
        });
      }
    });
    return () => cancelAnimationFrame(timer);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (formData.targetAmount <= 0) {
      toast.error('Please enter a valid target amount');
      return;
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Saving Goal' : 'Add New Saving Goal'}</DialogTitle>
          <DialogDescription>
            Set a savings goal to track your progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="savingTitle">Title</Label>
            <Input
              id="savingTitle"
              placeholder="e.g., New Car, Vacation"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="targetAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.targetAmount || ''}
                onChange={(e) => setFormData({ ...formData, targetAmount: parseFloat(e.target.value) || 0 })}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currentAmount">Current Amount</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="currentAmount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.currentAmount || ''}
                onChange={(e) => setFormData({ ...formData, currentAmount: parseFloat(e.target.value) || 0 })}
                className="pl-9"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetDate">Target Date (Optional)</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {initialData ? 'Update' : 'Add'} Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Main Component
export default function ExpenseTracker() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [savings, setSavings] = useState<Saving[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSavingFormOpen, setIsSavingFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editingSaving, setEditingSaving] = useState<Saving | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [addingMoneySaving, setAddingMoneySaving] = useState<Saving | null>(null);
  const [addMoneyAmount, setAddMoneyAmount] = useState<number>(0);

  // Check session
  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const data = await response.json();
        if (data?.user) {
          setUser(data.user);
        }
      }
    } catch {
      console.error('Session check failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch expenses
  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses');
      if (response.status === 401) {
        setUser(null);
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const data = await response.json();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setCategories(data);
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch savings
  const fetchSavings = async () => {
    try {
      const response = await fetch('/api/savings');
      if (response.ok) {
        const data = await response.json();
        setSavings(data);
      }
    } catch (error) {
      console.error('Error fetching savings:', error);
    }
  };

  // Logout
  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setExpenses([]);
    setSavings([]);
    toast.success('Logged out successfully');
  };

  // Export to Excel
  const handleExport = async () => {
    try {
      const response = await fetch('/api/export');
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'expense-tracker.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Data exported successfully!');
    } catch {
      toast.error('Failed to export data');
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  useEffect(() => {
    if (user) {
      fetchExpenses();
      fetchCategories();
      fetchSavings();
    }
  }, [user]);

  // Add expense
  const handleAddExpense = async (data: ExpenseFormData) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add expense');
      toast.success('Expense added successfully');
      setIsFormOpen(false);
      fetchExpenses();
    } catch {
      toast.error('Failed to add expense');
    }
  };

  // Update expense
  const handleUpdateExpense = async (data: ExpenseFormData) => {
    if (!editingExpense) return;
    try {
      const response = await fetch(`/api/expenses/${editingExpense.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update expense');
      toast.success('Expense updated successfully');
      setIsFormOpen(false);
      setEditingExpense(null);
      fetchExpenses();
    } catch {
      toast.error('Failed to update expense');
    }
  };

  // Delete expense
  const handleDeleteExpense = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete expense');
      toast.success('Expense deleted successfully');
      fetchExpenses();
    } catch {
      toast.error('Failed to delete expense');
    }
  };

  // Add saving
  const handleAddSaving = async (data: SavingFormData) => {
    try {
      const response = await fetch('/api/savings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to add saving');
      toast.success('Saving goal added successfully');
      setIsSavingFormOpen(false);
      fetchSavings();
    } catch {
      toast.error('Failed to add saving goal');
    }
  };

  // Update saving
  const handleUpdateSaving = async (data: SavingFormData) => {
    if (!editingSaving) return;
    try {
      const response = await fetch(`/api/savings/${editingSaving.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update saving');
      toast.success('Saving goal updated successfully');
      setIsSavingFormOpen(false);
      setEditingSaving(null);
      fetchSavings();
    } catch {
      toast.error('Failed to update saving goal');
    }
  };

  // Delete saving
  const handleDeleteSaving = async (id: string) => {
    try {
      const response = await fetch(`/api/savings/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete saving');
      toast.success('Saving goal deleted successfully');
      fetchSavings();
    } catch {
      toast.error('Failed to delete saving goal');
    }
  };

  // Add money to saving
  const handleAddMoney = async () => {
    if (!addingMoneySaving || addMoneyAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    try {
      const response = await fetch(`/api/savings/${addingMoneySaving.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: addMoneyAmount }),
      });
      if (!response.ok) throw new Error('Failed to add money');
      toast.success('Money added successfully!');
      setIsAddMoneyOpen(false);
      setAddingMoneySaving(null);
      setAddMoneyAmount(0);
      fetchSavings();
    } catch {
      toast.error('Failed to add money');
    }
  };

  // Filter expenses
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || expense.categoryId === filterCategory;
    const expenseDate = new Date(expense.date);
    const matchesMonth =
      expenseDate >= startOfMonth(filterMonth) && expenseDate <= endOfMonth(filterMonth);
    return matchesSearch && matchesCategory && matchesMonth;
  });

  // Calculate statistics
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const avgExpense = filteredExpenses.length > 0 ? totalExpenses / filteredExpenses.length : 0;
  const totalSavings = savings.reduce((sum, s) => sum + s.currentAmount, 0);
  const totalSavingsTarget = savings.reduce((sum, s) => sum + s.targetAmount, 0);

  // Category breakdown for pie chart
  const categoryBreakdown = categories.map((category) => {
    const categoryExpenses = filteredExpenses.filter((exp) => exp.categoryId === category.id);
    const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      name: category.name,
      value: total,
      color: category.color,
      icon: category.icon,
    };
  }).filter((item) => item.value > 0);

  // Monthly trend data for last 6 months
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(new Date(), 5 - i);
    const monthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startOfMonth(month) && expenseDate <= endOfMonth(month);
    });
    const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      month: format(month, 'MMM'),
      amount: total,
    };
  });

  // Daily expenses for current month
  const dailyExpenses = filteredExpenses.reduce((acc, expense) => {
    const day = format(new Date(expense.date), 'dd');
    acc[day] = (acc[day] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const dailyChartData = Object.entries(dailyExpenses)
    .map(([day, amount]) => ({ day, amount }))
    .sort((a, b) => parseInt(a.day) - parseInt(b.day));

  const chartConfig = {
    amount: {
      label: 'Amount',
      color: '#hsl(var(--chart-1))',
    },
  };

  // Show loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show auth screen if not logged in
  if (!user) {
    return <AuthScreen onLogin={checkSession} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Expense Tracker
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Welcome, {user.name || user.email}!
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleExport}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                onClick={() => {
                  setEditingExpense(null);
                  setIsFormOpen(true);
                }}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <SummaryCard
            title="Total Expenses"
            value={`$${totalExpenses.toFixed(2)}`}
            icon={Wallet}
            color="bg-gradient-to-br from-red-500 to-rose-600"
          />
          <SummaryCard
            title="This Month"
            value={format(filterMonth, 'MMMM yyyy')}
            icon={Calendar}
            color="bg-gradient-to-br from-blue-500 to-indigo-600"
          />
          <SummaryCard
            title="Transactions"
            value={filteredExpenses.length.toString()}
            icon={TrendingUp}
            color="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
          <SummaryCard
            title="Average Expense"
            value={`$${avgExpense.toFixed(2)}`}
            icon={PieChart}
            color="bg-gradient-to-br from-purple-500 to-violet-600"
          />
          <SummaryCard
            title="Total Savings"
            value={`$${totalSavings.toFixed(2)} / $${totalSavingsTarget.toFixed(2)}`}
            icon={PiggyBank}
            color="bg-gradient-to-br from-amber-500 to-orange-600"
          />
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-3">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <span className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setFilterMonth(subMonths(filterMonth, 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium min-w-[100px] text-center">
                    {format(filterMonth, 'MMM yyyy')}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setFilterMonth(new Date())}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="savings">Savings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Spending by Category</CardTitle>
                  <CardDescription>Where your money goes</CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryBreakdown.length > 0 ? (
                    <div className="flex flex-col lg:flex-row items-center gap-4">
                      <ChartContainer config={chartConfig} className="h-[200px] w-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={categoryBreakdown}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {categoryBreakdown.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                      <div className="flex-1 space-y-2">
                        {categoryBreakdown.map((item) => (
                          <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm">{item.icon} {item.name}</span>
                            </div>
                            <span className="text-sm font-medium">${item.value.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No expenses recorded yet
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Monthly Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Monthly Trend</CardTitle>
                  <CardDescription>Last 6 months overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="font-medium">{label}</div>
                                  <div className="text-sm text-muted-foreground">
                                    ${payload[0].value?.toFixed(2)}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="amount"
                          stroke="#10b981"
                          fill="url(#colorGradient)"
                          strokeWidth={2}
                        />
                        <defs>
                          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                <CardDescription>Your latest expenses</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredExpenses.length > 0 ? (
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      {filteredExpenses.slice(0, 5).map((expense) => (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                              style={{ backgroundColor: `${expense.category.color}20` }}
                            >
                              {expense.category.icon}
                            </div>
                            <div>
                              <p className="font-medium">{expense.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(expense.date), 'MMM dd, yyyy')}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold text-red-600">
                            -${expense.amount.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions yet. Add your first expense!
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Transactions</CardTitle>
                <CardDescription>
                  Showing {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredExpenses.length > 0 ? (
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-3">
                      {filteredExpenses.map((expense) => (
                        <div
                          key={expense.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                              style={{ backgroundColor: `${expense.category.color}20` }}
                            >
                              {expense.category.icon}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{expense.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {expense.category.name}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(expense.date), 'MMM dd, yyyy')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between sm:justify-end gap-4">
                            <p className="font-semibold text-lg text-red-600">
                              -${expense.amount.toFixed(2)}
                            </p>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingExpense(expense);
                                  setIsFormOpen(true);
                                }}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleDeleteExpense(expense.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-12">
                    <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No expenses found</p>
                    <Button
                      className="mt-4"
                      onClick={() => {
                        setEditingExpense(null);
                        setIsFormOpen(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Expense
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Savings Tab */}
          <TabsContent value="savings" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Savings Goals</h2>
                <p className="text-muted-foreground">Track your progress towards financial goals</p>
              </div>
              <Button
                onClick={() => {
                  setEditingSaving(null);
                  setIsSavingFormOpen(true);
                }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Goal
              </Button>
            </div>

            {savings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savings.map((saving) => {
                  const progress = (saving.currentAmount / saving.targetAmount) * 100;
                  return (
                    <Card key={saving.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{saving.title}</CardTitle>
                            {saving.targetDate && (
                              <CardDescription>
                                Target: {format(new Date(saving.targetDate), 'MMM dd, yyyy')}
                              </CardDescription>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingSaving(saving);
                                setIsSavingFormOpen(true);
                              }}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                              onClick={() => handleDeleteSaving(saving.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{progress.toFixed(1)}%</span>
                          </div>
                          <Progress value={Math.min(progress, 100)} className="h-2" />
                          <div className="flex justify-between text-sm">
                            <span className="text-green-600 font-medium">
                              ${saving.currentAmount.toFixed(2)}
                            </span>
                            <span className="text-muted-foreground">
                              of ${saving.targetAmount.toFixed(2)}
                            </span>
                          </div>
                          <div className="pt-2 flex items-center gap-2 text-sm">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              ${(saving.targetAmount - saving.currentAmount).toFixed(2)} remaining
                            </span>
                          </div>
                          <Button
                            className="w-full mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                            onClick={() => {
                              setAddingMoneySaving(saving);
                              setAddMoneyAmount(0);
                              setIsAddMoneyOpen(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Money
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <PiggyBank className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No savings goals yet</p>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setEditingSaving(null);
                      setIsSavingFormOpen(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Goal
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Daily Spending Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Daily Spending</CardTitle>
                <CardDescription>Your spending pattern this month</CardDescription>
              </CardHeader>
              <CardContent>
                {dailyChartData.length > 0 ? (
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="day" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          content={({ active, payload, label }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                  <div className="font-medium">Day {label}</div>
                                  <div className="text-sm text-muted-foreground">
                                    ${payload[0].value?.toFixed(2)}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No data available for this month
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Category Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category Statistics</CardTitle>
                <CardDescription>Breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categoryBreakdown.map((category) => {
                    const percentage = totalExpenses > 0 
                      ? ((category.value / totalExpenses) * 100).toFixed(1) 
                      : 0;
                    return (
                      <Card key={category.name} className="overflow-hidden">
                        <div
                          className="h-2"
                          style={{ backgroundColor: category.color }}
                        />
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{category.icon}</span>
                            <span className="font-medium">{category.name}</span>
                          </div>
                          <p className="text-2xl font-bold">${category.value.toFixed(2)}</p>
                          <p className="text-sm text-muted-foreground">{percentage}% of total</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-3">
          <p className="text-center text-sm text-muted-foreground">
            Expense Tracker • Track your spending wisely
          </p>
        </div>
      </footer>

      {/* Expense Form Modal */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
        initialData={editingExpense}
        categories={categories}
      />

      {/* Saving Form Modal */}
      <SavingForm
        isOpen={isSavingFormOpen}
        onClose={() => {
          setIsSavingFormOpen(false);
          setEditingSaving(null);
        }}
        onSubmit={editingSaving ? handleUpdateSaving : handleAddSaving}
        initialData={editingSaving}
      />

      {/* Add Money Dialog */}
      <Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Money to {addingMoneySaving?.title}</DialogTitle>
            <DialogDescription>
              Add money to your savings goal. Current: ${addingMoneySaving?.currentAmount.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="addMoneyAmount">Amount to Add</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="addMoneyAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={addMoneyAmount || ''}
                  onChange={(e) => setAddMoneyAmount(parseFloat(e.target.value) || 0)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddMoneyOpen(false);
                  setAddingMoneySaving(null);
                  setAddMoneyAmount(0);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleAddMoney}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                Add Money
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
