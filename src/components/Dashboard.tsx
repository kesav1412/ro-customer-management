import { Customer, Service } from '@/lib/supabase';
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import {
  People as UsersIcon,
  CalendarToday as CalendarIcon,
  Warning as AlertIcon,
  LocationOn as MapPinIcon,
  Build as BuildIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { addMonths, isBefore, isWithinInterval, addDays } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface DashboardProps {
  customers: Customer[];
  todayServices?: Service[];
  onViewTodayServices?: () => void;
}

export function Dashboard({ customers, todayServices = [], onViewTodayServices }: DashboardProps) {
  const getNextServiceDate = (installationDate: string) => {
    return addMonths(new Date(installationDate), 3);
  };

  const isOverdue = (installationDate: string) => {
    const nextService = getNextServiceDate(installationDate);
    return isBefore(nextService, new Date());
  };

  const isUpcoming = (installationDate: string) => {
    const nextService = getNextServiceDate(installationDate);
    const today = new Date();
    const thirtyDaysFromNow = addDays(today, 30);
    return isWithinInterval(nextService, { start: today, end: thirtyDaysFromNow });
  };

  const overdueCount = customers.filter(c => isOverdue(c.installation_date)).length;
  const upcomingCount = customers.filter(c => !isOverdue(c.installation_date) && isUpcoming(c.installation_date)).length;

  const cityDistribution = customers.reduce((acc, customer) => {
    acc[customer.city] = (acc[customer.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(cityDistribution)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const COLORS = ['#ea580c', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];

  const StatCard = ({ title, value, icon, color, subtitle }: any) => (
    <Card sx={{ borderLeft: 4, borderLeftColor: `${color}.main`, height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {icon}
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h3" fontWeight="bold" color={`${color}.main`}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(25% - 18px)' } }}>
          <StatCard
            title="Total Customers"
            value={customers.length}
            icon={<UsersIcon fontSize="small" />}
            color="primary"
          />
        </Box>

        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(25% - 18px)' } }}>
          <Card 
            sx={{ 
              borderLeft: 4, 
              borderLeftColor: 'warning.main', 
              height: '100%',
              cursor: onViewTodayServices ? 'pointer' : 'default',
              transition: 'all 0.2s',
              '&:hover': onViewTodayServices ? {
                transform: 'translateY(-4px)',
                boxShadow: 3,
              } : {},
            }}
            onClick={onViewTodayServices}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <BuildIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Today's Services
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h3" fontWeight="bold" color="warning.main">
                  {todayServices.length}
                </Typography>
                {onViewTodayServices && todayServices.length > 0 && (
                  <ArrowForwardIcon color="action" />
                )}
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Scheduled for today
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(25% - 18px)' } }}>
          <StatCard
            title="Upcoming Services"
            value={upcomingCount}
            icon={<CalendarIcon fontSize="small" />}
            color="success"
            subtitle="Next 30 days"
          />
        </Box>

        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(25% - 18px)' } }}>
          <StatCard
            title="Overdue Services"
            value={overdueCount}
            icon={<AlertIcon fontSize="small" />}
            color="error"
            subtitle="Requires attention"
          />
        </Box>
        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', lg: 'calc(25% - 18px)' } }}>
          <StatCard
            title="Cities Covered"
            value={Object.keys(cityDistribution).length}
            icon={<MapPinIcon fontSize="small" />}
            color="info"
          />
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" color="primary" fontWeight={600} gutterBottom>
            Customer Distribution by City
          </Typography>
          {chartData.length > 0 ? (
            <Box sx={{ width: '100%', height: 300, mt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="city" style={{ fontSize: '12px' }} />
                  <YAxis style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {chartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No data available
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
