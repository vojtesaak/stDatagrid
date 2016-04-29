var fixture = require('can-fixture');

var _ = {
    values: require('lodash/object/values'),
    map: require('lodash/collection/map'),
    has: require('lodash/object/has')
};


var persons = {
    data: [
        {
            name: 'Vojtěch Málek',
            email: 'vojtech.malek@storyous.com',
            position: 'Javascript Developer',
            motto: 'I hate PHP!',
            web: 'http://vojtechmalek.cz',
            favoriteLang: 'javascript'
        },
        {
            name: 'Václav Oborník',
            email: 'vaclav.obornik@storyous.com',
            position: 'Javascript Developer',
            motto: 'I have no motto!',
            web: null,
            favoriteLang: 'javascript'
        },
        {
            name: 'Lukáš Janský',
            email: 'lukas.jansky@storyous.com',
            position: 'Javascript Developer',
            motto: 'Fekal Party',
            web: null,
            favoriteLang: 'javascript'
        },
        {
            name: 'David Menger',
            email: 'david.menger@storyous.com',
            position: 'System Architect',
            motto: 'I love Javascript!',
            web: 'http://nodejsfan.com/',
            favoriteLang: 'javascript'
        },
        {
            name: 'Vojtěch Hájek',
            email: 'vojtech.hajek@storyous.com',
            position: 'Quality Assurance Tester',
            motto: 'I am the QA slave!',
            web: null,
            favoriteLang: 'php'
        },
        {
            name: 'Zdeněk Hásek',
            email: 'zdenek.hasek@storyous.com',
            position: 'Open Source Evangelist',
            motto: 'Use LINUX!',
            web: null,
            favoriteLang: 'golang'
        }
    ],
    nextPage: 0,
    page:0
};

fixture("GET /api/persons", function(request, response, headers){
    if (request.data.search) {
        var filtered = [];
        _.map(persons, function(val) {
            var vals = _.values(val);
            for ( var i in vals ) {
                if ( vals[i] && vals[i].toLowerCase().indexOf(request.data.search.toLowerCase()) >= 0 ) {
                    return filtered.push(val);
                }
            }
        });
        return filtered;
    }

    return persons;
});

/*
can.fixture("PUT /todos/{id}", function(request, response, headers){
    // update the todo's data
    can.extend(todos[request.data.id], request.data );
    response({});
});*/