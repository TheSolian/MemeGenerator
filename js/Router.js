export default class Router {
  constructor(routes) {
    this.routes = routes

    this.urlResolve = () => {
      this.navigate(location.hash)
    }

    this.navigate = (hash) => {
      let route = this.getRouteByHash(hash)
      history.pushState({}, "", hash)
      route?.function()
    }

    this.getRouteByHash = (hash) => {
      if (hash == "") {
        return routes["home"]
      }

      let route = routes["error"]
      Object.keys(routes).forEach((key) => {
        if (routes[key].hash == hash) {
          route = routes[key]
        }
      })
      return route
    }

    addEventListener("hashchange", (e) => {
      this.urlResolve()
    })
  }
}
