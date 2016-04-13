
var persons = [
    {
        name: 'Vojtěch Málek',
        position: 'FullStack Developer',
        motto: 'I hate PHP!'
    },
    {
        name: 'Václav Oborník',
        position: 'Javascript Developer',
        motto: 'I have no motto!'
    },
    {
        name: 'David Menger',
        position: 'System Architect',
        motto: 'I love Javascript!'
    },
    {
        name: 'Vojtěch Hájek',
        position: 'Quality Assurance Tester',
        motto: 'I am the QA slave!'
    },
    {
        name: 'Zdeněk Hásek',
        position: 'Open Source Evangelist',
        motto: 'Use LINUX!'
    }
];

can.fixture("GET /api/persons", function(request, response, headers){
    response(persons);
});

/*
can.fixture("PUT /todos/{id}", function(request, response, headers){
    // update the todo's data
    can.extend(todos[request.data.id], request.data );
    response({});
});*/