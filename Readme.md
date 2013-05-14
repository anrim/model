# model

Simple JavaScript model using ES5 accessor properties to access data. Models are observable so works well as context for reactive templates.

## Installation

	$ npm install anrim-model
    
    $ component install anrim/model

## API

    var User = Model()
    	.property('name', {required: true, minLength: 4})
    	.property('email', {format: "email"})
    	.property('roles', {type: "array", value: []);

## License

  MIT
