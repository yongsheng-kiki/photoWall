function on(ele,type,fn){
    if(ele.addEventListener){
        ele.addEventListener(type,fn,false);
        return;
    }
    if(!ele["aSuan"+type]) {
        ele["aSuan" + type] = [];
        ele.attachEvent("on" + type, function () {run.call(ele)});//只解决ie里的
    }
    var a=ele["aSuan"+type];
    //避免重复绑定
    for(var i=0;i< a.length;i++){
        if(a[i]==fn){
            return;
        }
    }
    a.push(fn);
    //bind(ele,type,run);//把bind方法的简单实现写在on方法里就可以了
}
//如下代码：on运行三次，则on方法76行代码就会运行三次,则变形的run方法就会被绑定三次，当click事件触发的时候，则变形的run方法就会运行三次,run方法每运行一次，就会遍历执行一次事件池，则这个程序池会被遍历三次，则被保存在程序池里的fn1，fn2，fn3会被分别执行三次
//则需要解决run方法被重复绑定的问题，即，无论on方法在处理相同的事件类型时运行多少次，run方法只能被绑定一次


function run() {
    var e = window.event;
    var type = e.type;
    if(!e.target){
        e.target= e.srcElement;
        e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
        e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
        e.preventDefault=function(){
            e.returnValue=false;
        };
        e.stopPropagation=function(){
            e.cancelBubble=true;
        }
    }
    var a = this["aSuan" + type];
    if (a) {
        for (var i = 0; i < a.length; i++) {
            if (typeof a[i] == "function") {
                a[i].call(this, e);//相当于类似标准浏览器那样，把事件对象当成一个参数传给了绑定的这个方法，这样就使IE和标准浏览器使用相同的方式获取事件对象了。
                //为什么要用call处理一下a[i]的执行：事件触发的方法在执行的时候this的原则是指向当前的元素(ele)；也就是说run里的this是ele，同样，a[i]（程序池a里保存的那些方法）也要指向ele，因为它们也是被绑定到事件上的方法（虽然不是真绑定）。所以，a[i]在执行的时候this也要强制让其指向run里的这个this，所以是a[i].call(this,e);如果直接写成a[i]();this就是数组a本身了
            } else {
                a.splice(i, 1);
                i--;
            }
        }
    }
}
function off(ele,type,fn){
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn,false);
    }else{
        var a=this["aSuan" + type];
        if(a){
            for(var i=0;i< a.length;i++){
                if(a[i]==fn){
                    a[i]=null;
                    return;
                }
            }
        }
    }
}

function processThis(fn,obj){
    return function(e){fn.call(obj,e)};
}
