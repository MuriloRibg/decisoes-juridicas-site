import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";

export const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "inicio"
  },
  {
    path: "inicio",
    title: "inicio",
    component: HomeComponent
  }
];
