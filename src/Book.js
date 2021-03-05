import moment from "moment";

class Book {
  dates = [];
  times = {};
  sizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  constructor(api) {
    this.api = api;
  }
  loadInventory() {
    return new Promise((resolve, reject) => {
      const date = moment();
      fetch(`${this.api}/inventory/${date.format("YYYY-MM-DD")}`).then(async (response) => {
        const inventory = await response.json();
        inventory.forEach((item) => {
          const day = moment(item.date).format("MMM-DD");
          if (!this.dates.includes(day)) {
            this.dates.push(day);
          }
          if (this.times[day] === undefined) {
            this.times[day] = [];
          }
          this.times[day].push(item.time);
        });
        resolve();
      });
    });
  }
  reserve(reservation) {
    return fetch(`${this.api}/reservation`, {
      method: "POST",
      headers: {
        'Content-Type': "application/json;charset=utf-8"
      },
      body: JSON.stringify(reservation)
    });
  }
}

export default Book;
