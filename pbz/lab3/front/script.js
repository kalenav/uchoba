const paramsObj = {
    class: 'Rifle',
    caliberMin: '5',
    effectiveRangeMax: '1000'
};
const searchParams = new URLSearchParams(paramsObj).toString();

fetch(`http://localhost:3000/firearms&${searchParams}`, {
    method: 'get'
})
.then(response => response.json())
.then(response => console.log(response));