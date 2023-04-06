const params = {
    className: "Riffe",
}
const searchParams = new URLSearchParams(params).toString();

fetch(`http://localhost:4000/newClass&${searchParams}`, {
    method: 'put'
})
.then(response => response.json())
.then(response => console.log(response));