//================================================================
//RandomWeapon.js
//================================================================
/*:
 *@plugindesc 随机获得某个范围内的物品。
 *@author Test1

 *@param price
 *@desc 每次购买所需要的钱。
 *@default 1000

  *@param baseid_1
 *@desc 获得第一组物品的基础ID。
 *@default 0

  *@param addid_1
 *@desc 第一组物品的范围增加ID。
 *@default 10

  *@param baseid_2
 *@desc 获得第二组物品的基础ID。
 *@default 10

  *@param addid_2
 *@desc 第二组物品的范围增加ID。
 *@default 20

  *@param baseid_3
 *@desc 获得第三组物品的基础ID。
 *@default 20

  *@param addid_3
 *@desc 第三组物品的范围增加ID。
 *@default 30

  *@param baseid_4
 *@desc 获得第四组物品的基础ID。
 *@default 30

  *@param addid_4
 *@desc 第四组物品的范围增加ID。
 *@default 40

 *@help 通过插件命令来实现效果。
 *插件指令：Getitem x y 获得y号变量个id为x号变量的物品
  *插件指令：Getweapons x y 获得y号变量个id为x号变量的武器
 *插件指令：Getarmors x y 获得y号变量个id为x号变量的防具
 *插件指令：Getitems x y z获得z号变量个id为x+y号变量的道具
 *例：baseid_1为5，addit_1为10时，指令RandomWeapon get1将会获得id为6~16之间的一个物品。
 *插件指令： RandomWeapon get ——随机花费1000货币获得一件武器(测试用)
 *插件指令： RandomWeapon get1 ——随机获得第一组的一件物品
 *插件指令： RandomWeapon get2 ——随机获得第二组的一件物品
 *以此类推。。。
*/

//这东西是定义一个对象，然后把插件里所有的东西都藏在这个对象里，防止和别的名字起冲突。
var RandomWeapon = window.RandomWeapon || {};
//在外面调用的话，都要使用RandomWeapon.来调用。
//这个东西和其它语言里的namespace很像，号称“名字空间”。
//向这个对象里添加内容，前面也要加RandomWeapon.

//这是我们允许获得的武器id，id是根据dataWeapons.js里的id属性确定的。
RandomWeapon.weaponsList = [1, 2, 3, 4];

//用于读取参数的对象
RandomWeapon.parameters = PluginManager.parameters('Test1_RandomWeapon'); //这里要保持与脚本的文件名一致
//这是每次随机的价格,从参数里面获得。
RandomWeapon.price = parseInt(RandomWeapon.parameters['price'] || '1000');
//其它参数获得
RandomWeapon.baseid1 = parseInt(RandomWeapon.parameters['baseid_1'] || '0');
RandomWeapon.addid1 = parseInt(RandomWeapon.parameters['addid_1'] || '10');
RandomWeapon.baseid2 = parseInt(RandomWeapon.parameters['baseid_2'] || '10');
RandomWeapon.addid2 = parseInt(RandomWeapon.parameters['addid_2'] || '20');
RandomWeapon.baseid3 = parseInt(RandomWeapon.parameters['baseid_3'] || '20');
RandomWeapon.addid3 = parseInt(RandomWeapon.parameters['addid_3'] || '30');
RandomWeapon.baseid4 = parseInt(RandomWeapon.parameters['baseid_4'] || '30');
RandomWeapon.addid4 = parseInt(RandomWeapon.parameters['addid_4'] || '40');
RandomWeapon.itemid = parseInt(RandomWeapon.parameters['itemid'] || '40');
//用于读取命令
RandomWeapon._Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command,args)
{
    RandomWeapon._Game_Interpreter_pluginCommand.call(this,command,args);
    if(command === 'RandomWeapon')
    {
        switch(args[0])
        {
            case 'get': //命令get
            RandomWeapon.getWeapon();
            break;
            case 'get1': //命令get1
            RandomWeapon.getItem1();
            break;
            case 'get2': //命令get2
            RandomWeapon.getItem2();
            break;
            case 'get3': //命令get3
            RandomWeapon.getItem3();
            break;
            case 'get4': //命令get4
            RandomWeapon.getItem4();
            break;
        }
    }
    if(command === 'Getitem')   //获取变量指定物品的函数，变量读操作：$gameVariables.value(VAR_ID); 变量写操作：$gameVariables.setValue(VAR_ID, val);
    {
        $gameParty.gainItem($dataItems[$gameVariables.value(Number(args[0]))],$gameVariables.value(Number(args[1])));    
    }
    if(command === 'Getweapons')  
    {
        $gameParty.gainItem($dataWeapons[$gameVariables.value(Number(args[0]))],$gameVariables.value(Number(args[1])));    
    }
    if(command === 'Getarmors')  
    {
        $gameParty.gainItem($dataArmors[$gameVariables.value(Number(args[0]))],$gameVariables.value(Number(args[1])));    
    }
    if(command === 'Getitems')   //获取变量指定物品的函数，变量读操作：$gameVariables.value(VAR_ID); 变量写操作：$gameVariables.setValue(VAR_ID, val);
    {
        $gameParty.gainItem($dataItems[$gameVariables.value(Number(args[0])) + $gameVariables.value(Number(args[1]))],$gameVariables.value(Number(args[2])));    
    }
}

//这是获得武器的函数，在面向对象里面，我们叫它“方法”。
RandomWeapon.getWeapon = function()
{
    if($gameParty.gold()<RandomWeapon.price)  //判断钱够不够，不够直接跳出去
    {
        return;
    }
    else
    {  //钱够的话，先弄个临时变量，乘以列表中的个数再取整，作为所得武器的id
        var id = Math.ceil(Math.random()*(RandomWeapon.weaponsList.length));
        //获得武器，mv的核心参数；前一个参数是从json里得到的武器对象，后一个参数是数量(我们只要一个)
        $gameParty.gainItem($dataWeapons[RandomWeapon.weaponsList[id]],1);
        //最后，把钱扣掉。。
        $gameParty.loseGold(RandomWeapon.price);
    }
}
//随机获得物品的函数
RandomWeapon.getItem1 = function()
{
    var id = Math.ceil(Math.random()*RandomWeapon.addid1) + RandomWeapon.baseid1;
     $gameParty.gainItem($dataItems[id],1);    
}
RandomWeapon.getItem2 = function()
{
    var id = Math.ceil(Math.random()*RandomWeapon.addid2) + RandomWeapon.baseid2;
     $gameParty.gainItem($dataItems[id],1);    
}
RandomWeapon.getItem3 = function()
{
    var id = Math.ceil(Math.random()*RandomWeapon.addid3) + RandomWeapon.baseid3;
     $gameParty.gainItem($dataItems[id],1);    
}
RandomWeapon.getItem4 = function()
{
    var id = Math.ceil(Math.random()*RandomWeapon.addid4) + RandomWeapon.baseid4;
     $gameParty.gainItem($dataItems[id],1);    
}
