<script>
  import moment from "moment";
  import Book from "./Book";
  export let api;
  let reservation = {
    name: "",
    email: "",
    party_size: 0,
    date: "",
    time: "",
  };
  let dates = [];
  let times = {};
  let sizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  let book = new Book(api);
  function load() {
    book.loadInventory().then(()=> {
      dates = book.dates;
      times = book.times;
    });
  }
</script>

<main>
  <h1>Book a Reservation</h1>
  <div class="field">
    <label for="name">Name:</label>
    <input id="name" bind:value={reservation.name} />
  </div>
  <div class="field">
    <label for="email">Email:</label>
    <input id="email" type="email" bind:value={reservation.email} />
  </div>
  <div class="field">
    <label for="party_size">Party size:</label>
    <select id="party_size" bind:value={reservation.party_size}>
      <option />
      {#each sizes as size}
        <option value={size}>
          {size}
        </option>
      {/each}
    </select>
  </div>
  <div class="field">
    <label for="date">Date:</label>
    <select id="date" bind:value={reservation.date}>
      <option />
      {#each dates as date}
        <option value={date}>
          {date}
        </option>
      {/each}
    </select>
  </div>
  <div class="field">
    <label for="time">Time:</label>
    <select id="time" bind:value={reservation.time}>
      <option />
      {#each times[reservation.date] || [] as time}
        <option value={time}>
          {time}
        </option>
      {/each}
    </select>
  </div>
  <div class="field">
    <button on:click={book.reserve(reservation).then(() => load())}>Reserve</button>
  </div>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
  .field {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: center;
  }
  .field label {
    margin-right: 1em;
    width: 6em;
  }
  .field input {
    width: 12em;
  }
  .field select {
    width: 12em;
  }
</style>
