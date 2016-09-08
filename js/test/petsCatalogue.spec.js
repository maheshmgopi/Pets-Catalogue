describe('PetsCatalogue', function () {

    var sampleData = [
        {
            "name": "Bob",
            "gender": "Male",
            "age": 23,
            "pets": [
                {
                    "name": "Garfield",
                    "type": "Cat"
                },
                {
                    "name": "Fido",
                    "type": "Dog"
                }
            ]
        },
        {
            "name": "Jennifer",
            "gender": "Female",
            "age": 18,
            "pets": [
                {
                    "name": "Garfield",
                    "type": "Cat"
                }
            ]
        },
        {
            "name": "Steve",
            "gender": "Male",
            "age": 45,
            "pets": null
        },
        {
            "name": "Fred",
            "gender": "Male",
            "age": 40,
            "pets": [
                {
                    "name": "Tom",
                    "type": "Cat"
                },
                {
                    "name": "Max",
                    "type": "Cat"
                },
                {
                    "name": "Sam",
                    "type": "Dog"
                },
                {
                    "name": "Jim",
                    "type": "Cat"
                }
            ]
        },
        {
            "name": "Samantha",
            "gender": "Female",
            "age": 40,
            "pets": [
                {
                    "name": "Tabby",
                    "type": "Cat"
                }
            ]
        },
        {
            "name": "Alice",
            "gender": "Female",
            "age": 64,
            "pets": [
                {
                    "name": "Simba",
                    "type": "Cat"
                },
                {
                    "name": "Nemo",
                    "type": "Fish"
                }
            ]
        }
    ];
  
    //ensures petsCatalogue is defined
    it('should be defined', function () {
        expect(petsCatalogue).toBeDefined();
    });

    //ensures fetchPets function is defined
    it('should have fetchPets() function', function () {
        expect(petsCatalogue.fetchPets).toBeDefined();
        expect(typeof petsCatalogue.fetchPets).toEqual('function');
    });

    //ensures pets list is returned on calling fetchPets method
    it('should return pets when fetchPets() is called', function (done) {
        spyOn(petsCatalogue, 'fetchPets').and.callFake(function () {
            return new Promise(function (resolve, reject) {
                resolve(sampleData);
            });
        });

        expect(function () {
            petsCatalogue.fetchPets().then(function (data) {
                expect(data).toEqual(sampleData);
                done();
            });
        }).not.toThrow();
    });

    //ensures the pets list is grouped by gender
    it('should filter given pet and group by gender', function () {
        var data = petsCatalogue.filterAndGroupByGender(sampleData, 'Cat');
        expect(data).toEqual({
            Male: ['Garfield', 'Jim', 'Max', 'Tom'],
            Female: ['Garfield', 'Simba', 'Tabby']
        });
    });

    //ensures when pet type is undefined the  filterAndGroupByGender function should return empty array for Male and Female
    it('should return an object with zero sized arrays when pet type is undefined', function () {
        var data = petsCatalogue.filterAndGroupByGender(sampleData, undefined);
        expect(data).toEqual({
            Male: [],
            Female: []
        });
    });

    //ensures filterByGenderAndType returns the array of cat names for the given gender
    it('should filter by gender and pet type', function () {
        var data = petsCatalogue.filterByGenderAndType(sampleData, 'Male', 'Cat');
        expect(data).toEqual(['Garfield', 'Jim', 'Max', 'Tom']);
        var data = petsCatalogue.filterByGenderAndType(sampleData, 'Female', 'Cat');
        expect(data).toEqual(['Garfield', 'Simba', 'Tabby']);
    });

    //ensures the nodes are created in dom when the dats is successfully fetched from server
    it('should add nodes into the dom when the formatted data is given', function () {
        petsCatalogue.displayData({
            Male: ['Garfield', 'Jim', 'Max', 'Tom'],
            Female: ['Garfield', 'Simba', 'Tabby']
        });
        var el = document.getElementById('container');
        expect(el).toBeDefined();
        expect(el.childNodes.length).toEqual(9);
        expect(el.childNodes[0].innerText).toEqual('Male');
        expect(el.childNodes[1].innerText).toEqual('Garfield');
        expect(el.childNodes[5].innerText).toEqual('Female');
        expect(el.childNodes[7].innerText).toEqual('Simba');
    });

});