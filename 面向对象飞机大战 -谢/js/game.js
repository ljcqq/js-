var Method=(function () {
    return {
        hitTest:function (disp1,disp2) {
            var rect1=disp1.getBoundingClientRect();
            var rect2=disp2.getBoundingClientRect();

            if(rect1.x>rect2.x && rect1.x<rect2.x+rect2.width && rect1.y>rect2.y && rect1.y<rect2.y+rect2.height){
                return true;
            }
            if(rect1.x+rect1.width>rect2.x && rect1.x+rect1.width<rect2.left+rect2.width && rect1.y>rect2.y && rect1.y<rect2.y+rect2.height){
                return true;
            }
            if(rect1.x>rect2.x && rect1.x<rect2.x+rect2.width && rect1.y+rect1.height>rect2.y && rect1.y+rect1.height<rect2.y+rect2.height){
                return true;
            }
            if(rect1.x+rect1.width>rect2.x && rect1.x+rect1.width<rect2.x+rect2.width && rect1.y+rect1.height>rect2.y && rect1.y+rect1.height<rect2.y+rect2.height){
                return true;
            }
            return false;
        }
    }
})();
var GameStart=(function () {
    var bnStyle={
        width:"150px",
        height:"50px",
        lineHeight:"50px",
        textAlign:"center",
        backgroundColor:"rgba(0,0,0,0)",
        border:"1px solid #000000",
        position:"absolute"
    };
    function GameStart() {

    }
    GameStart.GAME_RUN_EVENT="game_run_event";
    GameStart.prototype={
        view:null,
        config:null,
        initView:function () {
            if(!this.view){
                this.view=document.createElement("div");
                this.config=RES.JSONArr[0];
                this.view.style.width=this.config.bg.width+"px";
                this.view.style.height=this.config.bg.height+"px";
                this.view.style.position="absolute";
                this.view.appendChild(this.createBnView());
            }
            return this.view;
        },
        createBnView:function () {
            var bn=document.createElement("bn");
            bn.textContent="开始游戏";
            bnStyle.left=(this.config.bg.width-parseInt(bnStyle.width))/2+"px";
            bnStyle.top=(this.config.bg.height-parseInt(bnStyle.height))/2+"px";
            Object.assign(bn.style,bnStyle);
            bn.self=this;
            bn.addEventListener("click",this.clickHandler);
            return bn;
        },
        clickHandler:function (e) {
            var evt=new Event(GameStart.GAME_RUN_EVENT);
            this.self.view.dispatchEvent(evt);
        }
    };
    GameStart.prototype.constructor=GameStart;
    return GameStart;
})();
var GameOver=(function () {
    var bnStyle={
        width:"150px",
        height:"50px",
        lineHeight:"50px",
        textAlign:"center",
        backgroundColor:"rgba(0,0,0,0)",
        border:"1px solid #000000",
        position:"absolute"
    };
    function GameOver() {

    }
    GameOver.GAME_START_EVENT="game_start_event";
    GameOver.prototype={
        view:null,
        config:null,
        initView:function () {
            if(!this.view){
                this.view=document.createElement("div");
                this.config=RES.JSONArr[0];
                this.view.style.width=this.config.bg.width+"px";
                this.view.style.height=this.config.bg.height+"px";
                this.view.style.position="absolute";
                this.view.appendChild(this.createBnView());
            }
            return this.view;
        },
        createBnView:function () {
            var bn=document.createElement("bn");
            bn.textContent="重新开始";
            bnStyle.left=(this.config.bg.width-parseInt(bnStyle.width))/2+"px";
            bnStyle.top=(this.config.bg.height-parseInt(bnStyle.height))/2+"px"
            Object.assign(bn.style,bnStyle);
            bn.self=this;
            bn.addEventListener("click",this.clickHandler);
            return bn;
        },
        clickHandler:function (e) {
            var evt=new Event(GameOver.GAME_START_EVENT);
            this.self.view.dispatchEvent(evt);
        }
    };
    GameOver.prototype.constructor=GameOver;
    return GameOver;
})();
var Hero=(function (RES) {
    const LIVE_STATE="live_state";
    const DIE_STATE="die_state";
    function Hero(parent) {
        this.initHeroPlane(parent);
    }
    Hero.prototype={
        config:null,
        heroPlane:null,
        num:0,
        skinTime:5,
        skinArr:[],
        _state:"",
        parent:null,
        //发射点
        point:{x:0,y:0},
        //当前的子弹等级
        bulletLev:2,
        bombSum:3,
        _bloods:0,
        set bloods(value){
            if(value<0)return;
            this._bloods=value;
            if(value===0){
                this.state=DIE_STATE;
            }
        },
        get bloods(){
          return this._bloods;
        },
        set state(value){
            this._state=value;
            switch (value){
                case LIVE_STATE:
                    this.skinArr=this.config.live;
                    break;
                case DIE_STATE:
                    this.skinArr=this.config.die;
                    break;
            }
        },
        get state(){
          return this._state;
        },
        initHeroPlane:function (parent) {
            this.config=RES.JSONArr[0].hero;
            if(!this.heroPlane){
                this.parent=parent;
                this.state=LIVE_STATE;
                this.heroPlane=RES.getImage(this.skinArr[0]);
                this.bloods=10;
                parent.appendChild(this.heroPlane);
            }
        },
        update:function () {
            this.planeMove();
            this.planeSkinChange();
        },
        planeSkinChange:function () {
            if(!this.heroPlane)return;
            this.skinTime--;
            if(this.skinTime>0)return;
            this.skinTime=10;
            this.num++;
            if(this.num>this.skinArr.length-1){
                if(this.state===DIE_STATE){
                    var evt=new Event(GameRun.GAME_OVER_EVENT);
                    this.parent.dispatchEvent(evt)
                }
                this.num=0;
            }
            RES.getImage(this.skinArr[this.num],this.heroPlane);
        },
        planeMove:function () {
            if(!this.heroPlane)return;
            if(!document.point)return;
            if(document.point.x-this.heroPlane.offsetWidth/2<0) return;
            if(document.point.y-this.heroPlane.offsetHeight/2<0) return;
            if(document.point.x+this.heroPlane.offsetWidth/2>this.heroPlane.parentElement.offsetWidth) return;
            if(document.point.y+this.heroPlane.offsetHeight/2>this.heroPlane.parentElement.offsetHeight) return;
            this.heroPlane.style.left=document.point.x-this.heroPlane.offsetWidth/2+"px";
            this.heroPlane.style.top=document.point.y-this.heroPlane.offsetHeight/2+"px";
            this.point.x=document.point.x;
            this.point.y=this.heroPlane.offsetTop;
        }
    };
    Hero.prototype.constructor=Hero;
    return Hero;
})(RES);
var Bullet=(function (RES) {
    function Bullet(parent,point,state) {
        this.initBullet(parent,point,state);
    }
    Bullet.LEVEL_1="level_1";
    Bullet.LEVEL_2="level_2";
    Bullet.BOMB="bomb";
    Bullet.prototype={
        bullet:null,
        speed:8,
        //parent子弹放在谁的里面，point子弹的位置，state当前子弹的状态
        initBullet:function (parent,point,state) {
            if(!this.bullet){
                var i=0;
                switch (state){
                    case Bullet.LEVEL_1:
                        i=0;
                        break;
                    case Bullet.LEVEL_2:
                        i=1;
                        break;
                    case Bullet.BOMB:
                        i=2;
                        break;
                }
                this.bullet=RES.getImage(RES.JSONArr[0].bullet[i]);
                parent.appendChild(this.bullet);
                this.bullet.style.left=point.x-this.bullet.offsetWidth/2+"px";
                this.bullet.style.top=point.y+"px";
            }
        },
        update:function () {
            if(!this.bullet)return;
                this.bullet.style.top=this.bullet.offsetTop-this.speed+"px";
            if(this.bullet.offsetTop<-20){
                this.bullet.remove();
                this.bullet=null;
            }
        }
    };
    Bullet.prototype.constructor=Bullet;
    return Bullet;
})(RES);
var Enemy=(function (RES) {
    const LIVE_STATE="live_state";
    const HIT_STATE="hit_state";
    const DIE_STATE="die_state";
    function Enemy(parent,x,type) {
        this.initEnemy(parent,x,type);
    }
    Enemy.ENEMY_1="enemy_1";
    Enemy.ENEMY_2="enemy_2";
    Enemy.ENEMY_3="enemy_3";
    Enemy.prototype={
        enemyView:null,
        _enemyType:"",
        config:null,
        _state:"",
        skinArr:[],
        _blood:0,
        speed:3,
        skinNum:0,
        skinTime:10,
        set blood(value){
            if(value<0)return;
            this._blood=value;
            if(value%10===0){
                this.state=HIT_STATE;
            }
            if(value===0){
                this.state=DIE_STATE;
            }
            if(!this.enemyView)return;

            this.enemyView.bloodDiv.textContent=value;
        },
        get blood(){
            return this._blood;
        },
        set state(value){
            this._state=value;
            switch (value){
                case LIVE_STATE:
                    this.skinArr=this.config.live;
                    break;
                case HIT_STATE:
                    this.skinArr=this.config.hit;
                    break;
                case DIE_STATE:
                    this.skinArr=this.config.die;
                    break;
            }
        },
        get state(){
            return this._state;
        },
        set enemyType(value){
            this._enemyType=value;
            switch (value){
                case Enemy.ENEMY_1:
                    this.config=RES.JSONArr[0].enemy.enemy1;
                    this.blood=20;
                    break;
                case Enemy.ENEMY_2:
                    this.config=RES.JSONArr[0].enemy.enemy2;
                    this.blood=40;
                    break;
                case Enemy.ENEMY_3:
                    this.config=RES.JSONArr[0].enemy.enemy3;
                    this.blood=60;
                    break;
            }
        },
        get enemyType(){
            return this._enemyType;
        },
        initEnemy:function (parent,x,type) {
            if(!this.enemyView){
                this.enemyType=type;
                this.state=LIVE_STATE;
                this.enemyView=RES.getImage(this.config.live[0]);
                parent.appendChild(this.enemyView);
                var div=document.createElement("div");
                div.style.position="absolute";
                div.style.top="-30px";
                div.style.textAlign="center";
                div.textContent=this.blood;
                this.enemyView.appendChild(div);
                this.enemyView.bloodDiv=div;
                this.enemyView.style.left=x+"px";
                this.enemyView.style.top=-this.enemyView.offsetHeight+"px";
            }

        },
        update:function () {
            this.setEnemyPosition();
            this.updateSkin();
        },
        setEnemyPosition:function () {
            if(!this.enemyView)return;
            this.enemyView.style.top=this.enemyView.offsetTop+this.speed+"px";
            if(this.enemyView.offsetTop>this.enemyView.parentElement.offsetHeight){
                this.enemyView.remove();
                this.enemyView=null;
            }
        },
        updateSkin:function () {
            if(this.skinArr.length===0)return;
            if(!this.enemyView)return;
            this.skinTime--;
            if(this.skinTime>0)return;
            this.skinTime=5;
            var skinName=this.skinArr[this.skinNum];
            RES.getImage(skinName,this.enemyView);
            this.skinNum++;
            if(this.skinNum>this.skinArr.length-1){
                if(this.state===LIVE_STATE){
                    this.skinNum=0;
                }else if(this.state===HIT_STATE){
                    this.state=LIVE_STATE;
                }else if(this.state===DIE_STATE){
                    this.enemyView.remove();
                    this.enemyView=null;
                }
            }
        }
    };
    Enemy.prototype.constructor=Enemy;
    return Enemy;
})(RES);
var GameRun=(function (Hero,Bullet,Method) {
    function GameRun() {

    }
    GameRun.GAME_OVER_EVENT="game_over_event";
    GameRun.prototype={
        view:null,
        config:null,
        hero:null,
        shootBool:true,
        bulletList:[],
        enemyList:[],
        bulletTime:2,
        enemyTime:30,
        bombBool:false,
        enemyNum:0,
        pause:false,
        initView:function () {
            this.clearView();
            if(!this.view){
                this.view=document.createElement("div");
                this.config=RES.JSONArr[0];
                this.view.style.width=this.config.bg.width+"px";
                this.view.style.height=this.config.bg.height+"px";
                this.view.style.position="absolute";
                this.view.gamerun=this;
                // this.view.addEventListener("mousedown",this.mouseHandler);
                // this.view.addEventListener("mouseup",this.mouseHandler);
                document.gamerun=this;
                document.addEventListener("keydown",this.keydownHandler);
            }
            this.initHero(this.view);
            return this.view;
        },
        clearView:function () {
            if(this.view){
                var len=this.view.children.length;
                for(var i=0;i<len;i++){
                    this.view.firstElementChild.remove();
                }
            }

           this.hero=null;
            for(var j=0;j<this.bulletList.length;j++){
                this.bulletList[j]=null;
            }
            this.bulletList.length=0;
            for(var k=0;k<this.enemyList.length;k++){
                this.enemyList[k]=null;
            }
            this.enemyList.length=0;
        },
        initHero:function (parent) {
            if(!this.hero){
                this.hero=new Hero(parent);
            }
            return this.hero;
        },
        update:function () {
            if(this.pause)return;
            if(this.hero){
                this.hero.update();
                for(var i=0;i<this.enemyList.length;i++){
                    if(!this.enemyList[i] || !this.enemyList[i].enemyView) continue;
                    if(Method.hitTest(this.hero.heroPlane,this.enemyList[i].enemyView)){
                        this.hero.bloods--;
                    }
                }
            }
            if(this.shootBool){
                //增加子弹
               this.createBullet();
            }
            this.createBomb();
            this.bulletsUpdate();
            this.createEnemy();
            this.updateEnemy();
        },
        createEnemy:function () {
            if(!this.config)return;
            this.enemyTime--;
            if(this.enemyTime>0)return;
            this.enemyTime=80;
            var obj=this.config.enemyList[this.enemyNum];
            this.enemyNum++;
            if(this.enemyNum>this.config.enemyList.length-1){
                this.enemyNum=0;
            }
            if(!obj)return;
            for(var str in obj){
                for(var i=0;i<obj[str].length;i++){
                    var enemy=new Enemy(this.view,obj[str][i],str);
                    this.enemyList.push(enemy);
                }
            }
        },
        updateEnemy:function () {
            var arr=[];
              for(var i=0;i<this.enemyList.length;i++){
                  this.enemyList[i].update();
                  if(this.enemyList[i].enemyView){
                    arr.push(this.enemyList[i]);
                  }else{
                      this.enemyList[i]=null;
                  }
                  if(!this.enemyList[i])continue;
                  for(var j=0;j<this.bulletList.length;j++){
                      if(!this.bulletList[j].bullet || !this.enemyList[i].enemyView) continue;

                      if(Method.hitTest(this.bulletList[j].bullet,this.enemyList[i].enemyView)){

                          this.bulletList[j].bullet.remove();
                          this.bulletList[j].bullet=null;
                          if(this.hero.bulletLev===1){
                              this.enemyList[i].blood--;
                          }else if(this.hero.bulletLev===2){
                              this.enemyList[i].blood-=2;
                          }

                      }
                  }
              }
              this.enemyList=arr;
        },
        createBomb:function () {
            if(!this.bombBool)return;
                if(this.hero.bombSum>0){
                    var bullet=new Bullet(this.view,this.hero.point,Bullet.BOMB);
                    this.bulletList.push(bullet);
                    this.hero.bombSum--;
                }
                this.bombBool=false;

        },
        createBullet:function () {
            this.bulletTime--;
            if(this.bulletTime>0)return;
            this.bulletTime=2;
            var bullet=new Bullet(this.view,this.hero.point,this.hero.bulletLev===1 ? Bullet.LEVEL_1 : Bullet.LEVEL_2);
            this.bulletList.push(bullet);
        },
        bulletsUpdate:function () {
            var arr=[];
            for(var i=0;i<this.bulletList.length;i++){
                this.bulletList[i].update();
                if(this.bulletList[i].bullet){
                    arr.push(this.bulletList[i]);
                }else{
                    this.bulletList[i]=null;
                }
            }
            this.bulletList=arr;
        },
        mouseHandler:function (e) {
            if(e.type==="mousedown")
                this.gamerun.shootBool=true;
            else if(e.type==="mouseup")
                this.gamerun.shootBool=false;
        },
        keydownHandler:function (e) {
            if(e.keyCode===32){
                this.gamerun.bombBool=true;
            }
        }
    };
    GameRun.prototype.constructor=GameRun;
    return GameRun;
})(Hero,Bullet,Method);

var Game=(function (RES,GameStart,GameOver,GameRun) {
    const GAME_START="game_start";
    const GAME_RUN="game_run";
    const GAME_OVER="game_over";
    function Game(parent,reloadList) {
        this.parent=parent;
        RES.self=this;
        RES.initImgData(reloadList,this.loadFinish,"assets/");
    }
    Game.prototype={
        parent:null,
        view:null,
        viewBg:null,
        speed:5,
        config:null,
        gameStartView:null,
        gameRunView:null,
        gameOverView:null,
        gameRun:null,
        _state:"",
        set state(value){
            this._state=value;
            if(this.view.children.length===2){
                this.view.lastElementChild.remove();
            }
            switch (value){
                case GAME_START:
                    this.view.appendChild(this.gameStartView);
                    break;
                case GAME_RUN:
                    this.view.appendChild(this.gameRunView);
                    this.gameRun.initView();
                    break;
                case GAME_OVER:
                    this.view.appendChild(this.gameOverView);
                    break;
            }
        },
        get state(){
            return this._state;
        },
        loadFinish:function () {

            document.addEventListener("mousemove",this.self.mouseHandler);
            this.self.initView();
            document.view=this.self.view;
        },
        mouseHandler:function (e) {
            var rect=this.view.getBoundingClientRect();
            this.point={x:e.x-rect.left,y:e.y-rect.top};
        },
        initView:function () {
           if(RES.JSONArr.length===0) return;
            if(!this.view){
                this.view=document.createElement("div");
                if(this.parent){
                    this.parent.appendChild(this.view);
                }
                this.config=RES.JSONArr[0];
                this.view.style.width=this.config.bg.width+"px";
                this.view.style.height=this.config.bg.height+"px";
                this.view.style.position="relative";
                this.view.style.overflow="hidden";
                this.view.style.left=(document.body.clientWidth-this.config.bg.width)/2+"px";
                this.initBg();
                this.gameStartView=new GameStart().initView();
                this.gameStartView.self=this;
                this.gameRun=new GameRun();
                this.gameRunView=this.gameRun.initView();
                this.gameRunView.self=this;
                this.gameOverView=new GameOver().initView();
                this.gameOverView.self=this;
                this.state=GAME_RUN;
                this.gameStartView.addEventListener(GameStart.GAME_RUN_EVENT,function () {
                    this.self.state=GAME_RUN;
                });
                this.gameOverView.addEventListener(GameOver.GAME_START_EVENT,function () {
                    this.self.state=GAME_START;
                });
                this.gameRunView.addEventListener(GameRun.GAME_OVER_EVENT,function () {
                    this.self.state=GAME_OVER;
                })
            }
        },
        initBg:function () {
            if(!this.viewBg){
                this.viewBg=document.createElement("div");
                this.view.appendChild(this.viewBg);
                this.viewBg.style.width=this.config.bg.width+"px";
                this.viewBg.style.height=this.config.bg.height*2+"px";
                this.viewBg.style.fontSize="0px";
                var img=new Image();
                img.src=this.config.bg.bgImg;
                this.viewBg.appendChild(img);
                this.viewBg.appendChild(img.cloneNode(false));
                this.viewBg.style.position="absolute";
                this.viewBg.style.top=-this.config.bg.height+"px"
            }
        },
        update:function () {
            this.viewBgAnimation();
            if(this.gameRunView && this.gameRunView.parentElement){
                this.gameRun.update();
            }
        },
        viewBgAnimation:function () {
            if(!this.viewBg)return;
            this.viewBg.style.top=this.viewBg.offsetTop+this.speed+"px";
            if(this.viewBg.offsetTop>=0){
                this.viewBg.insertBefore(this.viewBg.lastElementChild,this.viewBg.firstElementChild);
                this.viewBg.style.top=-this.config.bg.height+"px";
            }
        }
    };
    Game.prototype.constructor=Game;
    return Game;
})(RES,GameStart,GameOver,GameRun);
/*
*   白盒测试
*   黑盒测试
*
* */