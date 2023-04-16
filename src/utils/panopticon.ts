// Create an Observable for the 'data' event of the Socket
const dataObservable = fromEvent(client, 'data').pipe(
    map((rawData) => {
    // Transform the raw data from the Socket into your desired data model
        return rawData;
    }
));