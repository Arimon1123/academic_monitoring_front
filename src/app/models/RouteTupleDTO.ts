import { RouteDTO } from './RouteDTO';

export interface RouteTupleDTO {
  uniqueRoutes: RouteDTO[];
  childRoutes?: RouteDTO[];
}
