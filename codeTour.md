# Code tour

1. backEnd/src/server.ts
	the first file to be executed, inits the http server.
2. backEnd/src/app.ts
	main file, contains the routes, app middleware, database initiation.
3. backEnd/src/modules/Glasses.ts
	glasses type/interface, mongodb schema and initiation of model. 
4. backEnd/src/controllers/glasses.ts
	glasses api endpoints.
5. frontEnd/src/app.component.ts
	app homepage, gets the glasses from db and displays them.
6. frontEnd/src/crawler/crawler.component.ts
	downloads and process glasses catalog, getting dimentions for each glasses, sends the glasses array to server for save.