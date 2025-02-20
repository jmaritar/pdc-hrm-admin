import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

// import { DataTableComponent } from '@app/shared/components/data-table/data-table.component';
import { BrnDialogContentDirective } from '@spartan-ng/brain/dialog';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@spartan-ng/brain/forms';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonDirective } from '@spartan-ng/ui-button-helm';
import {
  HlmDialogComponent,
  HlmDialogContentComponent,
  HlmDialogDescriptionDirective,
  HlmDialogFooterComponent,
  HlmDialogHeaderComponent,
  HlmDialogTitleDirective,
} from '@spartan-ng/ui-dialog-helm';
import { HlmFormFieldModule } from '@spartan-ng/ui-formfield-helm';
import { HlmInputDirective } from '@spartan-ng/ui-input-helm';
import { HlmSelectImports, HlmSelectModule } from '@spartan-ng/ui-select-helm';
import { toast } from 'ngx-sonner';

import { CountryService } from './countries.service';

@Component({
  standalone: true,
  selector: 'app-countries',
  imports: [
    // DataTableComponent,
    ReactiveFormsModule,
    BrnDialogContentDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmInputDirective,
    HlmFormFieldModule,
    HlmSelectModule,
    HlmButtonDirective,
    HlmSelectImports,
    BrnSelectImports,
  ],
  templateUrl: './countries.component.html',
  providers: [{ provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }],
})
export class CountriesComponent implements OnInit {
  private _formBuilder = inject(FormBuilder);
  private _countryService = inject(CountryService);

  columns = [
    { key: 'name', label: 'Nombre', width: '50%' },
    { key: 'code', label: 'Código', width: '30%' },
  ];

  data: any[] = [];
  selectedCountry: any = null;
  isModalOpen = false;
  isConfirmationOpen = false;

  form: FormGroup = this._formBuilder.group({
    name: ['', Validators.required],
    code: ['', [Validators.required, Validators.maxLength(3)]],
  });

  actions = [
    { label: 'Editar', callback: (row: any) => this.onEditCountry(row) },
    { label: 'Desactivar', callback: (row: any) => this.onDeactivateCountry(row) },
  ];

  ngOnInit() {
    this.loadCountries();
  }

  loadCountries() {
    this._countryService.getCountries().subscribe({
      next: (response: any) => (this.data = response.data ?? []),
      error: error => toast.error(error.message || 'Hubo un error al cargar los países.'),
    });
  }

  onEditCountry(country: any) {
    this.selectedCountry = country;
    this.isModalOpen = true;
    this.form.patchValue(country);
  }

  onDeactivateCountry(country: any) {
    this.selectedCountry = country;
    this.isConfirmationOpen = true;
  }

  onCreateCountry() {
    this.selectedCountry = null;
    this.isModalOpen = true;
    this.form.reset({ name: '', code: '' });
  }

  onModalClose() {
    this.selectedCountry = null;
    this.isModalOpen = false;
    this.isConfirmationOpen = false;
  }

  onConfirmAction() {
    const request = this.selectedCountry
      ? this._countryService.updateCountry(this.selectedCountry.id_country, this.form.value)
      : this._countryService.createCountry(this.form.value);

    request.subscribe({
      next: () => {
        toast.success(
          this.selectedCountry
            ? `${this.selectedCountry.name} ha sido actualizado.`
            : 'País creado con éxito.'
        );
        this.loadCountries();
        this.onModalClose();
      },
      error: error => toast.error(error.message || 'Error en la operación.'),
    });
  }

  onConfirmDeactivation() {
    this._countryService.deactivateCountry(this.selectedCountry.id_country).subscribe({
      next: () => {
        toast.success('País desactivado con éxito.');
        this.loadCountries();
        this.onModalClose();
      },
      error: error => toast.error(error.message || 'Error al desactivar el país.'),
    });
  }
}
