import * as shell from "shelljs";


shell.cp("-R", "src/public/js/lib", "dist/public/js/");
shell.cp("-R", "src/public/fonts", "dist/public/");
shell.cp("-R", "src/public/images", "dist/public/");

shell.cp("-R", "../frontEnd/src/assets", "dist/public/assets");

shell.exec("cd ..\\frontEnd && ng build --watch --aot --output-path ..\\backEnd\\dist\\app && cd ..\\backEnd", );