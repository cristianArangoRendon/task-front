import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginatorDTO } from 'src/app/core/data-transfer-object/common/paginator/paginator.dto';
import { TableResultDTO } from 'src/app/core/data-transfer-object/common/table-result/table-result.dto';
import { UserUseCase } from 'src/app/infrastructure/use-cases/app/user.usecase';
import { UserMapDataListDTO } from 'src/app/core/data-transfer-object/App/user.dto';
import { LoadingComponent } from 'src/app/_layout/common/loading/loading/loading.component';
import { CreateUpdateUserComponent } from './create-update-user/create-update-user.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule, 
    LoadingComponent
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {
  isLoading = true;
  users: UserMapDataListDTO[] = [];
  totalRecords: number = 0;
  dataSource = new MatTableDataSource<UserMapDataListDTO>([]);
  currentPage: number = 1; 
  
  filterForm: FormGroup;
  paginator: PaginatorDTO = {
    pageIndex: 1,
    pageSize: 6
  };

  @ViewChild(MatPaginator) paginatorRef: MatPaginator;

  constructor(
    private _userUseCase: UserUseCase,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
    this.filterForm = this.createFilterForm();
  }

  ngOnInit(): void {
    this.loadUsersData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginatorRef;
  }

  private createFilterForm(): FormGroup {
    return this.fb.group({
      isActiveUser: [null],
      searchTerm: ['']
    });
  }

  loadUsersData(): void {
    this.isLoading = true;
    const filters = this.filterForm.value;
    
    const filterParams: any = {};
    
    if (filters.isActiveUser !== null && filters.isActiveUser !== undefined) {
      filterParams.isActiveUser = filters.isActiveUser;
    }
    
    if (filters.searchTerm && filters.searchTerm.trim() !== '') {
      filterParams.nameUser = filters.searchTerm.trim();
      filterParams.emailUser = filters.searchTerm.trim();
    }
    
    this._userUseCase.GetListUsers(
      this.paginator,
      Object.keys(filterParams).length > 0 ? filterParams : undefined
    ).subscribe({
      next: (response: TableResultDTO) => {
        this.users = response.results || [];
        this.dataSource.data = this.users;
        this.totalRecords = response.totalRecords || 0;
        this.currentPage = this.paginator.pageIndex;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.showErrorMessage('Error al cargar los usuarios');
        console.error('Error loading users:', error);
      }
    });
  }

  getTotalPages(): number {
    return Math.ceil(this.totalRecords / this.paginator.pageSize);
  }

  onPageChange(): void {
    if (this.currentPage < 1) {
      this.currentPage = 1;
    } else if (this.currentPage > this.getTotalPages()) {
      this.currentPage = this.getTotalPages();
    }
    this.paginator.pageIndex = this.currentPage;
    this.loadUsersData();
  }

  onPageSizeChange(): void {
    this.paginator.pageIndex = 1;
    this.currentPage = 1;
    this.loadUsersData();
  }

  handlePageEvent(event: PageEvent): void {
    this.paginator.pageIndex = event.pageIndex + 1;
    this.paginator.pageSize = event.pageSize;
    this.currentPage = this.paginator.pageIndex;
    this.loadUsersData();
  }

  applyFilters(): void {
    this.paginator.pageIndex = 1;
    this.currentPage = 1;
    this.loadUsersData();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.filterForm.patchValue({ isActiveUser: null });
    this.paginator.pageIndex = 1;
    this.currentPage = 1;
    this.loadUsersData();
  }

  filterActiveUsers(): void {
    this.isLoading = true;

    this._userUseCase.GetActiveUsers().subscribe({
      next: (result: TableResultDTO) => {
        this.users = result.results || [];
        this.dataSource.data = this.users;
        this.totalRecords = result.totalRecords || 0;
        this.isLoading = false;
        this.paginator.pageIndex = 1;
        this.currentPage = 1;
        if (this.paginatorRef) {
          this.paginatorRef.firstPage();
        }
        this.showSuccessMessage('Mostrando solo usuarios activos');
      },
      error: (error) => {
        console.error('Error loading active users:', error);
        this.isLoading = false;
        this.showErrorMessage('Error al cargar usuarios activos');
      }
    });
  }

  addNewUser(): void {
    const dialogRef = this.dialog.open(CreateUpdateUserComponent, {
      width: '1200px',
      maxWidth: '95vw',
      disableClose: true,
      data: {
        user: null,
        isEdit: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsersData();
        this.showSuccessMessage('Usuario creado correctamente');
      }
    });
  }

  editUser(user: UserMapDataListDTO): void {
    const dialogRef = this.dialog.open(CreateUpdateUserComponent, {
      width: '1200px',
      maxWidth: '95vw',
      disableClose: true,
      data: {
        user: user,
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsersData();
        this.showSuccessMessage('Usuario actualizado correctamente');
      }
    });
  }

  deleteUser(user: UserMapDataListDTO): void {
    if (confirm(`¿Está seguro de que desea eliminar el usuario "${user.nameUser}"?`)) {
      this.isLoading = true;
      
      this._userUseCase.DeleteUser(user.userId).subscribe({
        next: (success) => {
          if (success) {
            this.loadUsersData();
            this.showSuccessMessage('Usuario eliminado correctamente');
          } else {
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.showErrorMessage('Error al eliminar el usuario');
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  exportData(): void {
    this._userUseCase.GetListUsers(undefined, undefined).subscribe({
      next: (data: TableResultDTO) => {
        this.showSuccessMessage('Datos preparados para exportar');
      },
      error: (error) => {
        console.error('Error exporting data:', error);
        this.showErrorMessage('Error al exportar los datos');
      }
    });
  }

  refreshData(): void {
    this.loadUsersData();
  }

  getUserStatus(user: UserMapDataListDTO): string {
    return user.isActiveUser ? 'status-active' : 'status-inactive';
  }

  getUserStatusText(user: UserMapDataListDTO): string {
    return user.isActiveUser ? 'Activo' : 'Inactivo';
  }

  getUserFullName(user: UserMapDataListDTO): string {
    return user.nameUser || 'Sin nombre';
  }

  getFormattedDate(date: Date | string | null | undefined): string {
    if (!date) return 'N/A';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  }

  trackByUserId(index: number, user: UserMapDataListDTO): number {
    return user.userId;
  }

  getStartRecord(): number {
    if (this.totalRecords === 0) return 0;
    return ((this.paginator.pageIndex - 1) * this.paginator.pageSize) + 1;
  }

  getEndRecord(): number {
    const end = this.paginator.pageIndex * this.paginator.pageSize;
    return end > this.totalRecords ? this.totalRecords : end;
  }

  private showSuccessMessage(message: string): void {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  private showErrorMessage(message: string): void {
    this._snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}