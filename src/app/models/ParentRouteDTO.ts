import { RouteDTO } from './RouteDTO';

export interface ParentRouteDTO {
  id: number;
  title: string;
  children: RouteDTO[];
}
