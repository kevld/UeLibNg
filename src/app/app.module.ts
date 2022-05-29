import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectComponent } from './project/components/project/project.component';
import { NgxsModule } from '@ngxs/store';
import { ProjectState } from './project/states/project.state';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { HttpClientModule } from '@angular/common/http';
import { AssetState } from './asset/states/asset.state';
import { TagComponent } from './tag/components/tag/tag.component';
import { TagState } from './tag/states/tag.state';
import { AssetComponent } from './asset/components/asset/asset.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectComponent,
    TagComponent,
    AssetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxsModule.forRoot([
      ProjectState,
      AssetState,
      TagState
    ]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
