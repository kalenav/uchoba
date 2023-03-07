function decompose(sentence) {
    fetch('http://127.0.0.1:5000/decompose', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sentence })
    })
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(error => console.error(error))
}

decompose('Выполни морфологический разбор слов в этом предложении.')