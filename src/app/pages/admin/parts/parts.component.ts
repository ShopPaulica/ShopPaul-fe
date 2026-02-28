import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ordersListComponent} from '../../../components/commands-list/orders-list.component';
import {NotificationService} from '../../../shared/services/notification.service';
import {catchError, Observable, throwError} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {VehiclesServices} from '../../../shared/services/vehicles.services';
import {DropdownComponent} from '../../../components/dropdown/dropdown.component';
import {AsyncPipe} from '@angular/common';
import {PartsService} from '../../../shared/services/parts.service';

@Component({
  selector: 'app-parts',
  imports: [
    ReactiveFormsModule,
    ordersListComponent,
    DropdownComponent,
    AsyncPipe,
  ],
  templateUrl: './parts.component.html',
  standalone: true,
  styleUrl: './parts.component.scss'
})
export class PartsComponent implements OnInit {
  public formParts!: FormGroup;
  public sections: string[] = [];
  public subsections: string[] = [];
  public titles: string[] = [];
  public selectedTab: number = 2;
  private section: string = '';
  private subsection: string = '';
  private title: string = '';

  constructor(
    private _fb: FormBuilder,
    private _ps: PartsService,
    private readonly _ns: NotificationService
  ) {}

  ngOnInit(): void {
    //todo move in a functions
    this._ps.sectionFiltersPage$.pipe(
      //todo
    ).subscribe((sections: string[] | null) => {
      this.sections = sections ?? []
    })
    this._ps.subsectionFiltersPage$.pipe(
      //todo
    ).subscribe((subsection: string[] | null) => {
      this.subsections = subsection ?? []
    })
    this._ps.titleFiltersPage$.pipe(
      //todo
    ).subscribe((titles: string[] | null) => {
      this.titles = titles ?? []
    })

    this.formParts = this._fb.group({
      section: ['', [Validators.required]],
      subsection: ['', [Validators.required]],
      title: ['', [Validators.required]],
    });

    this.initPartsSections();
  }

  public saveParts(): void {
    this._ps.savePart({
      section: this.formParts.controls['section'].value,
      subsection: this.formParts.controls['subsection'].value,
      title: this.formParts.controls['title'].value,
      order: 0,
    }).pipe(
      catchError((err: HttpErrorResponse) => {
        this._ns.error(
          'Nu am putut salva produsul. Eroare de server.',
          { title: 'Parts', durationMs: 4000 }
        );

        return throwError(() => err);
      })).subscribe(() => {
        this._ns.success('Success', { title: 'Create Part', durationMs: 4000 });
        this.initPartsSections();
      }
    )
  }

  public selectTab(nr: number): void {
    this.selectedTab = nr;
  }

  public sectionSelected(section: string) {
    if(section) {
      this._ps.getFilters(section);
    } else {
      this.initPartsSections();
    }
    this.section = section;
  }

  public subsectionSelected(subsection: string) {
    if(subsection && this.section) {
      this._ps.getFilters(this.section, subsection);
    } else if(this.section) {
      this._ps.getFilters(this.section);
    }
    this.subsection = subsection;
  }

  public titleSelected(title: string) {
    if(title) {
      this._ps.getFilters(this.section, this.subsection, title);
    } else if(this.section) {
      this._ps.getFilters(this.section, this.subsection);
    }
    this.title = title;
  }

  //todo muta in service toate astea
  public deleteParts(): void {
   this._ps.deleteProduct({
     section: this.section,
     subsection: this.subsection,
     title: this.title
   }).pipe(
     //todo
   ).subscribe(
     res => {
       console.log(res)
     }
   )
  }

  private initPartsSections(): void {
    this._ps.getFilters();
  }
}
