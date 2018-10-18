class CreateObj{
	constructor() {
	    this.ele = document.createElement('img');
		//初始化对象的状态
		this.init();
	}
	init(){
		//设置src属性
		this.ele.src = "img/16.jpg";
		document.body.appendChild(this.ele); //加入页面
		//两个速度
		this.speedX = this.randomInt(3,10);
		this.speedY = this.randomInt(3,10);
		this.sport();
		this.drag();
	}
	sport(){
		setInterval(()=>{
			let left = this.ele.offsetLeft + this.speedX;
			let top = this.ele.offsetTop + this.speedY;
			//设置边界
			if(left <= 0){
				left = 0;
				this.speedX *= -1;
			}
			if(left >= document.documentElement.clientWidth - this.ele.offsetWidth){
				left = document.documentElement.clientWidth - this.ele.offsetWidth;
				this.speedX *= -1;
			}
			if(top <= 0){
				top = 0;
				this.speedY *= -1;
			}
			if(top >= document.documentElement.clientHeight - this.ele.offsetHeight){
				top = document.documentElement.clientHeight - this.ele.offsetHeight;
				this.speedY *= -1;
			}
			this.ele.style.left = left + 'px';
			this.ele.style.top = top + 'px';
		},30)
	}
	drag(){
		this.ele.onmousedown = (evt)=>{
			let e = evt || window.event;
			this.disX = e.clientX - this.ele.offsetLeft;
			this.disY = e.clientY - this.ele.offsetTop;
			document.onmousemove = (evt)=>{
				let e = evt || window.event;
				let left = e.clientX - this.disX;
				let top = e.clientY  - this.disY;
				//边界
				if(left <= 0){
					left = 0;
				}
				if(left >= document.documentElement.clientWidth - this.ele.offsetWidth){
					left = document.documentElement.clientWidth - this.ele.offsetWidth;
				}
				if(top <= 0){
					top = 0;
				}
				if(top >= document.documentElement.clientHeight - this.ele.offsetHeight){
					top = document.documentElement.clientHeight - this.ele.offsetHeight;
				}
				this.ele.style.left = left + 'px';
				this.ele.style.top = top + 'px';
			}
			document.onmouseup = function(){
				document.onmousemove = null;
			}
			document.ondragstart = function(){
				return false;
			}
		}
	}
	randomInt(min,max){
		return Math.floor(Math.random() * (max - min + 1) + min);
	}
}