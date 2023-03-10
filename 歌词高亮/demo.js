// import lrc from './data.js'
// const lrc=require("./data.js")

/**
 * parseLrc解析字符串 将其变成我们方便操作的样子
 * 数组里面包着一个一个对象的形式
 */
function parseLrc(){
    let lrcArr=[]
    // 先以换行符号切割一次
    const lrcData=lrc.split('\n')
    for(var i=0;i<lrcData.length;i++){
        let obj={}
        obj.time=parseTime(lrcData[i].split(']')[0].substring(1))
        obj.words=lrcData[i].split(']')[1]
        lrcArr.push(obj)
    }
    console.log(lrcArr);
    return lrcArr
}
let lrcArr=parseLrc()


/**
 * 还需要一个函数专门来转化时间 变成秒数
 *这里我收到的是一个类似于00:28.06的字符串
 */
function parseTime(lrcTime){
    return lrcTime.split(':')[0]*60+lrcTime.split(':')[1]*1
}
/**
 * 我需要拿到在播放的那一秒 锁定的歌词是哪一句 即是哪个下标
 * @returns 
 */
function findIndex(){
    let currentTime=doms.audio.currentTime
    for(var i=0;i<lrcArr.length;i++){
        if(currentTime<lrcArr[i].time){
            return i-1
        }
    }
    return lrcArr.length-1
}

var doms = {
    container:document.querySelector('.container'),
    ul:document.querySelector('ul'),
    audio:document.querySelector('audio'),

};
/**
 * 页面准备工作
 */
function HtmlParse(){
    for(var i=0;i<lrcArr.length;i++){
        let li=document.createElement('li')
        li.innerText=lrcArr[i].words
        doms.ul.appendChild(li)
    }
}
HtmlParse()


var containerHeight=doms.container.clientHeight
var liHeight=doms.ul.children[0].clientHeight
/**
 * 关于偏移量这件事 需要画图 容器盒子和ul盒子和li之间的高度
 */
function setOffset(){
    let index=findIndex()
    console.log(index);
    let offset=liHeight*index+liHeight/2-containerHeight/2;
    if(offset<0){
        offset=0
    }
    console.log(offset);
    // 设置偏移量 而且准备设置高亮
    doms.ul.style.transform=`translateY(-${offset}px)`
    var li=doms.ul.querySelector(".active")
    // 存在一种情况 一开始 大家都没有active的情况 所以要判断
    if(li){
        li.className=""
    }
    doms.ul.children[index].classList.add("active")
}
doms.audio.addEventListener("timeupdate",setOffset)