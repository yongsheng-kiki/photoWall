
function EventEmitter() {
}
EventEmitter.prototype.on = function (type, fn) {//约定，订阅
    if (!this["aEvent" + type]) {
        this["aEvent" + type] = [];
    }
    var a = this["aEvent" + type];
    for (var i = 0; i < a.length; i++) {
        if (a[i] == fn) return;
    }
    a.push(fn);
    return this;
};
EventEmitter.prototype.run = function (e,systemEvent) {//  通知，回调
    var a = this["aEvent"+ e.type];

    if(a){
        for(var i=0;i< a.length;i++){
            if(typeof a[i]=="function"){
                a[i].call(this,e,systemEvent);//第二个参数是指浏览器的事件对象，如有必要，还可以把浏览器的事件对象传进来
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
};
EventEmitter.prototype.off = function (type,fn) {//解除约定、解除订阅
    var a=this["aEvent"+type];
    if(a){
        for(var i=0;i< a.length;i++){
            if(a[i]==fn){
                a[i]=null;
                return this;
            }
        }
    }
    return this;
};
function Drag(ele){//类名 也是构造函数
    //构造函数是初始化的作用
    this.x=null;
    this.y=null;
    this.mx=null;
    this.my=null;
    this.ele=ele;//把ele这个私有变量上保存的DOM元素，保存到公有变量this.ele上
    //要想实现拖拽要处理好mousedown事件
    // on(this.ele,"mousedown",this.down);
    //this要指向类的实例，以上绑定方式和事件处理中的this原则冲突
    this.DOWN=processThis(this.down,this);
    on(ele,"mousedown",this.DOWN);//这样处理当事件触发的时候执行的是this.DOWN ,this.DOWN里的this是ele;  this.down里的this是实例
    this.MOVE=processThis(this.move,this);
    this.UP=processThis(this.up,this);
}
Drag.prototype=new EventEmitter;
Drag.prototype.down=function(e){
    this.x=this.ele.offsetLeft;
    this.y=this.ele.offsetTop;
    this.mx= e.pageX;
    this.my= e.pageY;
    if(this.ele.setCapture){
        thie.ele.setCapture();
        on(this.ele,"mousemove",this.MOVE);
        on(this.ele,"mouseup",this.UP);
    }else{
        on(document,"mousemove",this.MOVE);
        on(document,"mouseup",this.UP);
    }
    e.preventDefault();

    this.run({type:"dragstart"},e);
};
Drag.prototype.move=function(e){
    this.ele.style.left=this.x+ e.pageX-this.mx+"px";
    this.ele.style.top=this.y+ e.pageY-this.my+"px";
    this.run({type:"dragging"},e);//type 是"dragging"相当于事件类型
};
Drag.prototype.up=function(e){
    if(this.ele.releaseCapture){
        this.ele.releaseCapture();
        off(this.ele,"mousemove",this.MOVE);
        off(this.ele,"mouseup",this.UP);
    }else{
        off(document,"mousemove",this.MOVE);
        off(document,"mouseup",this.UP);
    }
    this.run({type:"dragend"},e);
};