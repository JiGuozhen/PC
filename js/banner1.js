//1.获取并解析数据 2.绑定数据 3.延迟加载 4.图片自动轮播 5.焦点自动轮播 6.移入移出 7.点击焦点手动切换
(function() {
    var oBox=document.getElementById('box1');

    var oBoxinner=oBox.getElementsByTagName('div')[0];
    var oUl=oBox.getElementsByTagName('ul')[0];
    var oDiv=oBoxinner.getElementsByTagName('div');
    var oImg=oBoxinner.getElementsByTagName('img');
    var oLi=oBox.getElementsByTagName('li');
    var oA=oBox.getElementsByTagName('a');
    var data=null;
    var interval=2000;
    var step=0;
    var autoTimer=null;
    //1.获取并解析数据
    getData();
    function getData(){
        var xml=new XMLHttpRequest;
        xml.open('get','json/data1.txt?='+Math.random(),false);
        xml.onreadystatechange=function(){
            if(xml.readyState===4&&/^2\d{2}$/.test(xml.status)){
                data=utils.jsonParse(xml.responseText)
            }
        };
        xml.send()
    }
    //2.绑定数据
    bind();
    function bind(){
        var str1='';
        for(var i=0;i<data.length;i++){
            str1+='<div><img realImg="'+data[i].imgSrc+'" alt=""/></div>'
        }
        str1+='<div><img realImg="'+data[0].imgSrc+'" alt=""/></div>';
        oBoxinner.innerHTML=str1;
        oBoxinner.style.width=oDiv.length*oDiv[0].offsetWidth+'px'
    }
    //3.延迟加载
    setTimeout(lazyImg,300);
    function lazyImg(){
        for(var i=0;i<oImg.length;i++){
            var tmpImg=new Image;
            tmpImg.src=oImg[i].getAttribute('realImg');
            tmpImg.index=i;
            tmpImg.onload=function(){
                oImg[this.index].src=this.src;
            }
        }
    }
    //4.图片自动轮播
    clearInterval(autoTimer)
    autoTimer=setInterval(autoMove,interval);
    function autoMove(){
        if(step>=oDiv.length-1){
            step=0;
            utils.css(oBoxinner,'left',0)
        }
        step++;
        zhufengAnimate(oBoxinner,{left:-step*304},1000)
    }


    //6.移入移出
    oBox.onmouseover=function(){
        clearTimeout(autoTimer);
        oA[0].style.display=oA[1].style.display='block'
    };
    oBox.onmouseout=function(){
        autoTimer=setInterval(autoMove,interval);
        oA[0].style.display=oA[1].style.display='none'
    };
    //8：左右按钮切换
    oA[1].onclick=autoMove;
    oA[0].onclick=function(){
        if(step<=0){
            step=oLi.length;
            utils.css(oBoxinner,'left',-step*304)
        }
        step--;
        zhufengAnimate(oBoxinner,{left:-step*304},1000)
    }
})();
