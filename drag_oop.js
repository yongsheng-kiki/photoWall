
function EventEmitter() {
}
EventEmitter.prototype.on = function (type, fn) {//Լ��������
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
EventEmitter.prototype.run = function (e,systemEvent) {//  ֪ͨ���ص�
    var a = this["aEvent"+ e.type];

    if(a){
        for(var i=0;i< a.length;i++){
            if(typeof a[i]=="function"){
                a[i].call(this,e,systemEvent);//�ڶ���������ָ��������¼��������б�Ҫ�������԰���������¼����󴫽���
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
};
EventEmitter.prototype.off = function (type,fn) {//���Լ�����������
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
function Drag(ele){//���� Ҳ�ǹ��캯��
    //���캯���ǳ�ʼ��������
    this.x=null;
    this.y=null;
    this.mx=null;
    this.my=null;
    this.ele=ele;//��ele���˽�б����ϱ����DOMԪ�أ����浽���б���this.ele��
    //Ҫ��ʵ����קҪ�����mousedown�¼�
    // on(this.ele,"mousedown",this.down);
    //thisҪָ�����ʵ�������ϰ󶨷�ʽ���¼������е�thisԭ���ͻ
    this.DOWN=processThis(this.down,this);
    on(ele,"mousedown",this.DOWN);//���������¼�������ʱ��ִ�е���this.DOWN ,this.DOWN���this��ele;  this.down���this��ʵ��
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
    this.run({type:"dragging"},e);//type ��"dragging"�൱���¼�����
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