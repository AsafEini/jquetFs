"use strict";

/* Constructor File */
function File(id, name, type, content, parentId) {
    this._id = id;
    this._name = name;
    this._type = type;
    this._content = content;
    this._parentId = parentId;
    this._children = [];
}

File.prototype.rename = function(name){
    this._name = name;
};

File.prototype.isType = function(type){
    if (this._type === type){
        return true;
    }
    return false;
};

File.prototype.addChild = function(file){
    this._children.push(file);
};

File.prototype.deleteChild = function (file) {
    var i = 0;
    while (i < this._children.length){
        if (this._children[i] === file){
            this._children.splice(i, 1);
            break;
        }
        i++;
    }
};

File.prototype.changeContent = function (content) {
    this._content = content;
};



/* Constructor File System */
function FileSystem(name) {
    this._root = new File(0, name, 'directory', '', -1);
    this._files = [this._root];

}

FileSystem.prototype.addNewDirectory = function (name, parentId) {
    var newFile = new File(this._files.length, name, 'directory', '', parentId);
    this._files.push(newFile);
    this._files[parentId].addChild(newFile);
};

FileSystem.prototype.addNewTextFile = function (name,parentId,content) {
    var newTextFile = new File(this._files.length,name,'text',content,parentId);
    this._files.push(newTextFile);
    this._files[parentId].addChild(newTextFile);
};

FileSystem.prototype.deleteFile = function(id){
    var fileToDelete = this._files[id];
    var parentFile = this._files[fileToDelete._parentId];
    //parentFile.deleteChild(fileToDelete);
    //this._files[id] = undefined;

    parentFile.deleteChild(fileToDelete);

    for(var i = 0; i < this._files.length; i++){
        if(this._files[i]){
            if(this._files[i]._parentId == fileToDelete._id){
                this._files[i] = undefined;
            }
        }
    }

    this._files[id] = undefined;

};

FileSystem.prototype.getFileById = function (id) {
    return this._files[id];
};

FileSystem.prototype.getLastId = function(){
    return this._files.length-1;
};

FileSystem.prototype.findParent = function(id){
    var targetFile = this._files[id];
    var parent = this._files[targetFile._parentId];
    return parent;
};

FileSystem.prototype.isFileNameExist = function(fileId,name,type){
    var file = this.getFileById(fileId);
    for(var i = 0; i < file._children.length; i++){

        if(file._children[i]._type === type && file._children[i]._name === name) {
            return true;
        }
    }
    return false;
};





FileSystem.prototype.getUnduplicatedFileName = function(folderId,name,type){
    var fileName = name;
    var counter = 0;
    var flag = true;

    while(flag){
        if(counter > 0){
            fileName = name + "("+ counter + ")";
        }
        if(!this.isFileNameExist(folderId, fileName, type)){
            flag = false;
        }
        counter++;
    }
    return fileName;
};


FileSystem.prototype.savingToLocalStorage = function(){
    var saveArray = [];
    for(var i = 0; i < this._files.length; i++){
        if(this._files[i]) {
            saveArray.push([this._files[i]._id, this._files[i]._name, this._files[i]._type,
                this._files[i]._parentId, this._files[i]._content]);
        }
    }
    localStorage.setItem('FileSystem',JSON.stringify(saveArray));
};
