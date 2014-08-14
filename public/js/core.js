angular.module('ballonide', []);

function filesCtrl($scope, $http) {
  //$scope.current_dir = '/home/luca/projects/ballonide';
  $scope.current_dir = 'C:/Users/Luca/Documents/Visual Studio 2013/Projects/BallonIDE/BallonIDE';
  $scope.dirs = [];

  $http.get('/api/v1/dir?dir=' + $scope.current_dir)
    .success(function (data) {
        console.log(data);
      if (data.status) {
        for (var i in data.files) {
          $scope.dirs.push({
            path: data.dir,
            file: data.files[i].file,
            dir: data.files[i].dir,
            visible: true,
            expanded: false,
            files: []
          });
        }
      }
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  $scope.fileClicked = function(object) {
    console.log("ITEM CLICKED", object);
    var path = object.path + "/" + object.file;
    if (object.dir) {
      if (object.expanded == undefined || object.expanded == false) {
        console.log("expanding object");
        object.expanded = true;
        if (object.files.length == 0) {
          console.log("getting object children");
          $http.get('/api/v1/dir?dir=' + path).success(function(data) {
            if (data.status) {
              object.files = [];
              for (var j in data.files) {
                object.files.push({
                  path: data.dir,
                  file: data.files[j].file,
                  dir: data.files[j].dir,
                  visible: true,
                  expanded: false,
                  files: []
                });
                
              }
            }
            console.log($scope.dirs);
          });
        } else {
          console.log("showing object children");
          for (var j in object.files) {
            object.files[j].visible = true;
          }
        }
      } else {
        console.log("hiding object children");
        object.expanded = false;
        for (var j in object.files) {
          object.files[j].visible = false;
        }
      }
    } else {
      $http.get('/api/v1/file?filename=' + path).success(function(data) {
        var s = data.file.split(".");
        var ext = s[s.length-1];
        var mode = 'text';
        if (ext == 'css')
          mode = "css";
        if (ext == 'js')
          mode = "javascript";
        if (ext == 'ts')
          mode = "text/typescript";
        if (ext == 'html') {
          mode = {
            name: "htmlmixed",
            scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
             mode: null},
            {matches: /(text|application)\/(x-)?vb(a|script)/i,
             mode: "vbscript"}]
          };
        }

        console.log("MODE:", mode);

        _the_editor.setMode(mode);
        _the_editor.setText(data.body);
        _code_engine.enqueue(path);
      });
    }
  }
}