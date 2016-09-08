(function (context) {

    'use strict';

    // dom element
    var el;

    //define all constants
    var constants = {
        fetchPetsUrl: 'http://agl-developer-test.azurewebsites.net/people.json',
        petType: 'Cat',
        targetContainerId: 'container',
        defaultErrorMessage: 'Sorry, could not fetch data from server!'
    };

    /**
     * Returns cached dom element
     * @returns dom element
     */
    function element() {
        return el || (el = document.getElementById(constants.targetContainerId));
    }

    /**
     * Retrieves the pets list from the server
     * @returns Promise
     */
    function fetchPets() {
        return fetch(constants.fetchPetsUrl).then(function (response) {
            return response.json();
        });
    }

    /**
     * Success Callback function for the fetchPets api call
     * @param {Object} response
     * @returns {Object}
     */
    function filterAndGroupByGender(response, petType) {
        return (response || [])

            // take gender 
            .map(function (item) { return item.gender; })

            // find unique gender
            .reduce(function (accumulator, item) {
                if (accumulator.indexOf(item.gender) < 0) {
                    accumulator.push(item)
                }
                return accumulator;
            }, [])

            // find pets name for each gender
            .reduce(function (accumulator, gender) {
                accumulator[gender] = filterByGenderAndType(response, gender, petType);
                return accumulator;
            }, {});
    }

    /**
     * Filteres the given data obejct to return the array of petType for the given gender
     * @param {Array} data
     * @param {String} gender
     * @param {String} petType
     * @returns {Array}
     */
    function filterByGenderAndType(data, gender, petType) {
        return data
            .filter(function (owner) {
                return owner.gender === gender;
            })
            .map(function (owner) {
                return owner.pets || [];
            })
            .reduce(function (a, item) {
                return a.concat(item);
            }, [])
            .filter(function (pet) {
                return pet.type === petType;
            })
            .map(function (pet) {
                return pet.name;
            })
            .sort();
    }

    /**
     * Binds the retrieved data from the server to html
     * @param {Object} data
     * @returns {undefined}
     */
    function displayData(data) {
        element().innerHTML = Object.keys(data).reduce(function (html, group) {
            html += '<h4>' + group + '</h4>';
            return data[group].reduce(function (itemHTML, item) {
                return itemHTML + '<li>' + item + '</li>'
            }, html);
        }, '');
    }

    // make the petsCatalogue global to be able to access from test specs
    context.petsCatalogue = {
        fetchPets: fetchPets,
        displayData: displayData,
        filterByGenderAndType: filterByGenderAndType,
        filterAndGroupByGender: filterAndGroupByGender
    };

    // init
    fetchPets().then(function (response) {
        var data = filterAndGroupByGender(response, constants.petType);
        displayData(data);
    }, function processError(error) {
        element().innerHTML = constants.defaultErrorMessage;
        console.error(error);
    });

})(this);