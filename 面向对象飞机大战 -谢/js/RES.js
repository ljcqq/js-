var RES=(function () {
    const FINISH_EVENT="finish_event";
    return {
        imgSrc:"",
        JSONArr:[],
        callback:null,
        initImgData:function (arr,callback,imgSrc) {
            if(imgSrc){
                this.imgSrc=imgSrc;
            }
            this.callback=callback;
            document.self=this;
            this.loadJSON(arr);
        },
        loadJSON:function (arr,num) {
            if(!num) num=0;
            var xhr=new XMLHttpRequest();
            xhr.self=this;
            xhr.num=num;
            xhr.arr=arr;
            xhr.addEventListener("load",this.jsonLoadHandler);
            xhr.open("GET",this.imgSrc+arr[num]+".json");
            xhr.send();
        },
        jsonLoadHandler:function (e) {
            this.self.JSONArr.push(JSON.parse(this.response));
            this.num++;
            if(this.num>this.arr.length-1){
                this.self.callback();
                return;
            }
            this.self.loadJSON(this.arr,this.num);
        },
        getImage:function (name,div) {
            if(!div){
                div=document.createElement("div");
            }
            var pngName="";
            var JSONObj=null;
            this.JSONArr.map(function (t) {
                if(!t.frames)return;
                t.frames.map(function (t2) {
                    if(t2.filename===name){
                        JSONObj=t2;
                        pngName=t.meta.image.split(".png")[0];

                    }
                });

            });
            if(!JSONObj) return div;
            div.style.width=JSONObj.frame.w+"px";
            div.style.height=JSONObj.frame.h+"px";
            div.style.position="absolute";
            div.style.backgroundImage="url("+this.imgSrc+pngName+".png)";
            div.style.backgroundPositionY=-JSONObj.frame.y+"px";
            // div.style.border="1px solid #000000";
            div.style.backgroundPositionX=-JSONObj.frame.x+"px";
            return div;
        }
    }
})();
var RESXml=(function () {
    const FINISH_EVENT="finish_event";
    return {
        imgSrc:"",
        JSONArr:[],
        callback:null,
        initImgData:function (arr,callback,imgSrc) {
            if(imgSrc){
                this.imgSrc=imgSrc;
            }
            this.callback=callback;
            document.self=this;
            this.loadJSON(arr);
        },
        loadJSON:function (arr,num) {
            if(!num) num=0;
            var xhr=new XMLHttpRequest();
            xhr.self=this;
            xhr.num=num;
            xhr.arr=arr;
            xhr.addEventListener("load",this.jsonLoadHandler);
            xhr.open("GET",this.imgSrc+arr[num]+".xml");
            xhr.send();
        },
        jsonLoadHandler:function (e) {
            this.self.JSONArr.push(this.responseXML.lastElementChild);
            this.num++;
            if(this.num>this.arr.length-1){
                this.self.callback();
                return;
            }

            this.self.loadJSON(this.arr,this.num);
        },
        getImage:function (name,div) {
            if(!div){
                div=document.createElement("div");
            }
            var pngName="";
            var JSONObj=null;
            this.JSONArr.map(function (t) {
                for(var i=0;i<t.children.length;i++){
                    if(t.children[i].getAttribute("n")===name){
                        JSONObj=t.children[i];
                        pngName=t.getAttribute("imagePath");
                    }
                }

            });
            div.style.width=JSONObj.getAttribute("w")+"px";
            div.style.height=JSONObj.getAttribute("h")+"px";
            div.style.backgroundImage="url("+this.imgSrc+pngName+")";
            div.style.backgroundPositionY=-JSONObj.getAttribute("y")+"px";
            div.style.backgroundPositionX=-JSONObj.getAttribute("x")+"px";
            return div;
        }
    }
})();
var ClassMethod=(function () {
    return {
        extend:function (subClass,supClass) {
            function F() {}
            F.prototype=supClass.prototype;
            subClass.prototype=new F();
            subClass.prototype.constructor=subClass;
            subClass.superClass=supClass.prototype;
            if(supClass.prototype.constructor===Object.constructor.constructor){
                supClass.prototype.constructor=supClass;
            }


        }
    }
})();