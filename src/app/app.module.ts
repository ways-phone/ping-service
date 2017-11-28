import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { FileReaderComponent } from "./file-reader/file-reader.component";
import { HeaderComponent } from "./header/header.component";
import { HttpModule } from "@angular/http";

import { PingService } from "./ping-service";
import { SpinnerComponent } from "./spinner/spinner.component";
import { SlimLoadingBarModule } from "ng2-slim-loading-bar";
import { PendingChangesGuard } from "./pending-changes.guard";

@NgModule({
  declarations: [
    AppComponent,
    FileReaderComponent,
    HeaderComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SlimLoadingBarModule.forRoot()
  ],
  providers: [PingService, PendingChangesGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
