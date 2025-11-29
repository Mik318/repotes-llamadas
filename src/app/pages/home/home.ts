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
  start_time: string;
  call_sid: string;
  user_intent: string | null;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
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

  ngOnInit(): void {
    this.loadCalls();
  }

  loadCalls(): void {
    this.dashBoardService.getCallsApiCallsGet().subscribe((res) => {
      console.log('Calls loaded:', res);
      this.calls.set(res as CallData[]);
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

  formatDate(dateString: string): string {
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
