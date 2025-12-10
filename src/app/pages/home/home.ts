import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../libs/ia-call-api';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

interface InteractionLog {
  user: string;
  ai: string;
  timestamp: number;
}

interface CallData {
  id: number;
  status: string;
  duration: number | null;
  interaction_log: InteractionLog[];
  user_phone: string;
  start_time: string | null;
  call_sid: string;
  user_intent: string | null;
}

interface CallsResponse {
  calls: CallData[];
  total: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private dashBoardService = inject(DashboardService);

  calls = signal<CallData[]>([]);
  selectedCall = signal<CallData | null>(null);
  filterStatus = signal<string>('all');
  searchQuery = signal<string>('');

  // Computed statistics
  stats = computed(() => {
    const allCalls = this.calls();
    return {
      total: allCalls.length,
      active: allCalls.filter((c) => c.status === 'active').length,
      withInteractions: allCalls.filter((c) => c.interaction_log.length > 0).length,
      avgInteractions:
        allCalls.length > 0
          ? Math.round(
              (allCalls.reduce((sum, c) => sum + c.interaction_log.length, 0) / allCalls.length) *
                10
            ) / 10
          : 0,
    };
  });

  // Filtered calls
  filteredCalls = computed(() => {
    let result = this.calls();

    // Filter by status
    const status = this.filterStatus();
    if (status !== 'all') {
      result = result.filter((c) => c.status === status);
    }

    // Filter by search
    const query = this.searchQuery().toLowerCase();
    if (query) {
      result = result.filter(
        (c) =>
          c.user_phone.includes(query) ||
          c.call_sid.toLowerCase().includes(query) ||
          c.id.toString().includes(query)
      );
    }

    return result;
  });

  // Configuración de gráfica de dona - Estado de llamadas
  public statusChartData = computed(() => {
    const allCalls = this.calls();
    const activeCount = allCalls.filter(c => c.status === 'active').length;
    const otherCount = allCalls.length - activeCount;

    return {
      labels: ['Activas', 'Otras'],
      datasets: [{
        data: [activeCount, otherCount],
        backgroundColor: ['#4ade80', '#94a3b8'],
        borderWidth: 0,
      }]
    } as ChartConfiguration<'doughnut'>['data'];
  });

  public statusChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#e2e8f0',
          font: { size: 12 },
          padding: 10,
          boxWidth: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        padding: 12,
        cornerRadius: 8,
        displayColors: true
      }
    }
  };

  // Configuración de gráfica de barras - Interacciones por llamada
  public interactionsChartData = computed(() => {
    const allCalls = this.calls().slice(0, 10); // Top 10 más recientes

    return {
      labels: allCalls.map(c => `#${c.id}`),
      datasets: [{
        label: 'Interacciones',
        data: allCalls.map(c => c.interaction_log.length),
        backgroundColor: '#3b82f6',
        borderRadius: 4,
      }]
    } as ChartConfiguration<'bar'>['data'];
  });

  public interactionsChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#e2e8f0',
          stepSize: 1,
          font: { size: 11 }
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#e2e8f0',
          font: { size: 11 },
          maxRotation: 0,
          minRotation: 0
        },
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        padding: 12,
        cornerRadius: 8
      }
    }
  };

  // Configuración de gráfica de línea - Tendencia de llamadas
  public callsTrendChartData = computed(() => {
    const allCalls = this.calls();
    // Agrupar por rangos (últimos 10 IDs)
    const ranges: string[] = [];
    const counts: number[] = [];
    const step = Math.max(1, Math.floor(allCalls.length / 10));

    for (let i = 0; i < allCalls.length; i += step) {
      const chunk = allCalls.slice(i, i + step);
      if (chunk.length > 0) {
        ranges.push(`${chunk[0].id}-${chunk[chunk.length - 1].id}`);
        counts.push(chunk.length);
      }
    }

    return {
      labels: ranges.slice(0, 10),
      datasets: [{
        label: 'Llamadas',
        data: counts.slice(0, 10),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    } as ChartConfiguration<'line'>['data'];
  });

  public callsTrendChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#e2e8f0',
          stepSize: 1,
          font: { size: 11 }
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#e2e8f0',
          maxRotation: 45,
          minRotation: 30,
          font: { size: 10 },
          autoSkip: true,
          maxTicksLimit: 8
        },
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        padding: 12,
        cornerRadius: 8
      }
    }
  };

  ngOnInit(): void {
    this.loadCalls();
  }

  loadCalls(): void {
    this.dashBoardService.getCallsApiCallsGet().subscribe((res: CallsResponse) => {
      this.calls.set(res.calls);
    });
  }

  selectCall(call: CallData): void {
    this.selectedCall.set(call);
  }

  closeDetails(): void {
    this.selectedCall.set(null);
  }

  updateFilter(status: string): void {
    this.filterStatus.set(status);
  }

  updateSearch(query: string): void {
    this.searchQuery.set(query);
  }

  formatDate(dateString: string | null): string {
    if (!dateString) {
      return 'N/A';
    }
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  }

  formatPhone(phone: string): string {
    // Format phone number for better readability
    return phone.replace(/(\+\d{2})(\d{3})(\d{3})(\d{4})/, '$1 $2 $3 $4');
  }
}
