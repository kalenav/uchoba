const params = {
    currName: 'P90',
    newName: 'petushara',
    newCaliber: 12.7,
    newRange: 1830
}
const searchParams = new URLSearchParams(params).toString();

fetch(`http://localhost:4000/updateIndividual&${searchParams}`, {
    method: 'put'
})
.then(response => response.json())
.then(response => console.log(response));