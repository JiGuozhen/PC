/**
 * Created by xiao lei on 2016/7/7.
 */
function Banner(idName,interval){
    this.oBox=document.getElementById(idName);
    this.oBoxInner=this.oBox.getElementsByTagName('div')[0];
    this.aDiv=this.oBoxInner.getElementsByTagName('div');
    this.aImg=this.oBoxInner.getElementsByTagName('img');
    this.oUl=this.oBox.getElementsByTagName('ul')[0];
    this.aLi=this.oBox.getElementsByTagName('li');
    this.autoTimer=null;
    this.step=0;
    this.interval=interval||3000;
    this.init();
}
Banner.prototype={
    constructor:Banner,
    init:function(){
        var _this=this;
        this.getData();

        this.bind();

        this.lazyImg();

        clearInterval(this.autoTimer);
        this.autoTimer=setInterval(function(){
            _this.autoMove();

        },this.interval);

        this.overOut();
        this.handleChange();


    },
    getData:function(){
        var _this=this;
        var xml=new XMLHttpRequest;
        xml.open('get','json/data2.txt?='+Math.random(),false);
        xml.onreadystatechange=function(){
            if(xml.readyState===4 && /^2\d{2}$/.test(xml.status)){
                _this.data=utils.jsonParse(xml.responseText);
            }
        };
        xml.send()
    },

    bind:function (){
        var str1='';
        var str2='';
       /* var ary=this.text();*/

        for(var i=0; i<this.data.length; i++){
            str1+='<div><img realImg="'+this.data[i].imgSrc+'" alt=""/></div>';
            str2+='<li class="bg"><a href="#" >'+this.data[i].text+'</a></li>'

        }
        this.oBoxInner.innerHTML=str1;
        this.oUl.innerHTML=str2;
    },
    lazyImg:function (){
        var _this=this;
        for(var i=0; i<this.aImg.length; i++){
            (function(index){
                var tmpImg=new Image;
                tmpImg.src=_this.aImg[index].getAttribute('realImg');
                tmpImg.onload=function(){
                    _this.aImg[index].src=this.src;
                    utils.css(_this.aDiv[0],'zIndex',1);
                    zhufengAnimate(_this.aDiv[0],{opacity:1},2000);
                }

            })(i);
        }
    },
    autoMove:function(){
        if(this.step>=this.aDiv.length-1){
            this.step=-1;
        }
        this.step++;

        this.setBanner();
    },
    setBanner:function(){
        for(var i=0; i<this.aDiv.length; i++){
            var curEle=this.aDiv[i];
            if(i===this.step){
                utils.css(curEle,'zIndex',1);
                this.aLi[i].style.background="green";

                zhufengAnimate(curEle,{opacity:1},500,function(){
                    var siblings=utils.siblings(this);
                    for(var j=0; j<siblings.length; j++){
                        utils.css(siblings[j],'opacity',0)
                    }
                })
            }else{
                utils.css(curEle,'zIndex',0);
                this.aLi[i].style.background="";
            }
        }
        this.bannerTip();
    },
    bannerTip:function(){
        for(var i=0; i<this.aLi.length; i++){
            this.aLi[i].className=i===this.step?'bg':'';
        }
    },
    overOut:function(){
        var _this=this;
        this.oBox.onmouseover=function(){
            clearInterval(_this.autoTimer);
        };
        this.oBox.onmouseout=function(){
            _this.autoTimer=setInterval(function(){
                _this.autoMove();
            },_this.interval);
        }
    },
    handleChange:function(){
        var _this=this;
        for(var i=0; i<this.aLi.length; i++){
            (function(index){
                _this.aLi[index].onclick=function(){
                    _this.step=index;
                    _this.setBanner();
                }
            })(i);
        }
    }

};