import { RouteDTO } from './RouteDTO';
import { ParentRouteDTO } from './ParentRouteDTO';

export interface RouteTupleDTO {
  uniqueRoutes: RouteDTO[];
  childRoutes?: RouteDTO[];
  parentRoutes?: ParentRouteDTO[];
}
