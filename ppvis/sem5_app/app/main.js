class App {
    main() {
        this.UserController = new UserController();
        this.driverController = new DriverController();
    }
}

class UserController {
    constructor() {
        this.currentRole = Role.passenger;
    }

    openMainScreen() {
        ui.openMainScreen();
    }

    changeRole() {
        this.currentRole = this.currentRole === Role.passenger ? Role.driver : Role.passenger;
    }

    openProfile() {
        ui.openUserCabinet();
    }
}

class Role {
    static passenger = 'passenger';
    static driver = 'driver';
}

class PassengerController extends UserController {
    openCurrentTrip() {
        ui.openTripScreen();
    }
}

class User {
    constructor(id) {
        this.id = id;
        this.name = 'akrick';
        this.surname = 'ok';
    }
}

class Passenger extends User {
    constructor() {
        super();
        this.phoneNumber = '555';
    }
}

class OrderService {
    constructor() {
        this.orderStorage = new OrderStorage();
    }

    createOrder(order) {
        this.orderStorage.add(order);
    }

    findOrder(id) {
        return this.orderStorage.get(id);
    }
}

class Storage {
    constructor() {
        this.storage = [];
    }

    add(toAdd) {
        this.storage.push(toAdd);
    }

    update(toUpdate) {
        this.storage.splice(
            this.storage.findIndex(el => el.id === toUpdate.id),
            1,
            toUpdate
        );
    }

    get(id) {
        return this.storage.find(el => el.id === id);
    }
}

class OrderStorage extends Storage {
    constructor() {
        super();
        this.storage = [new Order(), new Order(), new Order()];
    }
}

class Order {
    constructor() {
        this.orderNumber = 1;
        this.startingAddress = new Address();
        this.endingAddress = new Address();
        this.datetime = new Date();
        this.passenger = new Passenger();
        this.carGroup = new CarGroup();
    }
}

class Address {
    constructor() {
        this.id = 5;
        this.address = '70th Princess st.';
    }
}

class CarGroup {
    constructor() {
        this.name = 'Premium';
        this.additionalEarnings = 0.5;
        this.description = 'please make an order'
    }
}

class DriverController {
    constructor() {
        this.driver = new Driver();
        this.orderService = orderService;
        this.driverService = new DriverService();
    }

    registerDriver(driver) {
        this.driverService.registerDriver(driver);
    }
}

class DriverService {
    constructor() {
        this.driverStorage = new DriverStorage();
    }

    registerDriver(driver) {
        this.driverStorage.add(driver);
    }

    findFreeDriver() {
        this.driverStorage.get();
    }
}

class DriverStorage extends Storage {
    constructor() {
        super();
        this.storage = [new Driver(), new Driver(), new Driver()];
    }
}

class Driver extends User {
    constructor() {
        super();
        this.phoneNumber = '444';
        this.passportNumber = 'MP1111111';
        this.car = new Car();
    }
}

class Car {
    constructor() {
        this.id = 2;
        this.brand = 'Chevrolet';
        this.model = 'Corvette C6';
        this.carNumber = '9862 KO-7';
        this.color = 'Deep blue';
        this.seats = 1;
        this.description = 'Objectively the best car in the world';
        this.carGroup = premiumCarGroup;
    }
}

class Trip {

}

class UI {
    constructor() {
        this.mainContainer = document.getElementById('main-container');
    }

    openTripScreen() {
        this.openScreen(`
            <div class="header">
                <div class="return-icon" onclick="ui.openMainScreen()">
                    <i class="fa-solid fa-arrow-left-long"></i>
                </div>
                <div class="header-text">
                    Статус поездки
                </div>
            </div>
            <div class="main">
                <div class="big-grey-square"></div>
                <div class="address-input-block">
                    <label class="text-input-label" for="starting-address">Начальный адрес</label>
                    <input type="text" id="starting-address" class="text-input">
                    <label class="text-input-label" for="ending-address">Конечный адрес</label>
                    <input type="text" id="ending-address" class="text-input">
                    <button class="time-button">
                        <div class="circular-time-border">
                            <div class="time">12:36</div>
                        </div>
                    </button>
                </div>
            </div>
        `);
    }

    openMainScreen() {
        this.openScreen(`
            <div class="header">
                <div class="return-icon">
                    <i class="fa-solid fa-repeat"></i>
                </div>
            </div>
            <div class="main">
                <div class="centered-button-block">
                    <button class="full-width-purple-button" onclick="ui.openTripScreen()">
                        Оформить заказ/Текущая поездка
                    </button>
                    <button class="full-width-blue-button" onclick="ui.openUserCabinet()">
                        Личный Кабинет
                    </button>
                </div>
            </div>
            <button class="full-width-blue-button">
                Выйти
            </button>
        `)
    }

    openUserCabinet() {
        this.openScreen(`        
        <div class="header">
            <div class="return-icon" onclick="ui.openMainScreen()">
                <i class="fa-solid fa-arrow-left-long"></i>
            </div>
        </div>
        <div class="main align-left">
            <label class="text-input-label" for="name">Ваше имя</label>
            <input class="text-input" type="text" id="name">
            <label class="text-input-label" for="name">Ваша фамилия</label>
            <input class="text-input" type="text" id="surname">
            <label class="text-input-label" for="name">Ваш номер телефона</label>
            <input class="text-input" type="text" id="phone">
        </div>
        <div class="bottom-button-block">
            <button class="full-width-purple-button" onclick="ui.openMainScreen()">Зарегистрироваться</button>
            <button class="full-width-blue-button">Выйти</button>
        </div>
    `)
    }

    openScreen(screenInnerHTML) {
        this.mainContainer.innerHTML = screenInnerHTML;
    }
}

const orderService = new OrderService();
const premiumCarGroup = new CarGroup();
const users = [new Passenger(10), new Driver(11), new Passenger(12), new Driver(13), new Driver(14)];
const currentUser = users[2];
const ui = new UI();

ui.openUserCabinet();