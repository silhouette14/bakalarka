import { ChartsModule } from 'ng2-charts';
import { LayoutModule } from '@angular/cdk/layout';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ModalModule, WavesModule, InputsModule } from 'angular-bootstrap-md';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FlashMessagesModule } from 'angular2-flash-messages';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppComponent } from './app.component';
import { AuthGuard } from './guards/auth.guard';
import { TosterService } from './services/toster.service';
import { AuthService } from './services/auth.service';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GraphComponent } from './components/exchange/graph/graph.component';
import { RatesComponent } from './components/exchange/rates/rates.component';
import { ExchangeComponent } from './components/exchange/exchange.component';
import { SlidebarComponent } from './components/slidebar/slidebar.component';
import { PieChartComponent } from './components/ui/pie-chart/pie-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ExchangeComponent,
    NavbarComponent,
    GraphComponent,
    RatesComponent,
    SlidebarComponent,
    PieChartComponent,
    // RateChartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    ModalModule, WavesModule, InputsModule,
    MatCheckboxModule,
    AppRoutingModule,
    LayoutModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatTabsModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    HttpClientModule,
    FlashMessagesModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    ChartsModule
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [AuthService, TosterService, AuthGuard, GraphComponent, ExchangeComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
