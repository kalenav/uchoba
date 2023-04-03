const params = {
    class: "Rifle",
    caliberMin: 7,
    effectiveRangeMax: 500
}
const searchParams = new URLSearchParams(params).toString();

fetch(`http://localhost:3000/firearms&${searchParams}`, {
    method: 'get'
})
.then(response => response.json())
.then(response => console.log(response));