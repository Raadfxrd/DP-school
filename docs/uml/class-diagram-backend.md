First draft Class Diagram backend

```mermaid
classDiagram
  direction RL
class User {
    <<type>>
  + id: number
  + email: string
  + password: string
  + name: string
  + firstName?: string
  + lastName?: string
  + addresses?: Address[]
  + orders?: Order[]
  + authorizationLevel?: AuthorizationLevel
  + cart?: ShoppingCart
}

class Address {
  + id: number
  + street: string
  + city: string
  + zip: string
  + country: string
}

class AuthorizationLevel{
     <<enumeration>>
  USER = "user"
  EMPLOYEE = "employee"
  ADMIN = "admin"
}

class OrderItem {
  + id: number
  + name: string
  + description?: string
  + price: number
  + imageURLs?: string[]
}

class Order {
  + id: number
  + products: OrderItem[]
  + status: string
}

class Adress {
  + id: number
  + street: string
  + city: string
  + zip: string
  + country: string
}


class CartItem {
  + id: number
  + amount: number
  + product: Product  // reference to Product class
}

class Product {
  + id: number
  + name: string
  + inStock: boolean  // potentially new attribute
  + period: Period   // reference to Period class - details about sales period/availability?
  + price: number
  + imageURLs?: string[]
}

class Service {
  + id: number
  + name: string
  + description: string
  + price: number
  + getDetails()
}

class Category {
  + id: number
  + name: string
  + getProducts()
}

class Period {
  + id: number
  + startDate: string
  + endDate: string
  + name: string  // optional
  + isActive()
}

class Request  {
    <<interface>>
}

class Middleware  {
    <<module>>
  + handleTokenBasedAuthentication(user?: User, req: Request, res: Response, next: NextFunction): NextFunction | void
}

class OrderItemController  {
    <<module>>
  + getAll(req: Request, res: Response): void
}

class UserController  {
    <<module>>
  + register(req: Request, res: Response): void
  + login(req: Request, res: Response): void
  + logout(req: Request, res: Response): void
  + hello(req: Request, res: Response): void
  + addOrderitem ToCart(req: Request, res: Response): void
}

    Order "0" --> "0..n" OrderItem
    UserData "0" --> "0..n" Order
    UserData "0" --> "0..n" Adress
    UserData "0" --> "0..n" CartItem


```
