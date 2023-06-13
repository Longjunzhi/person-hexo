---
title: laravel多对多关联
date: 2022-07-15 09:41:26
tags:
 - laravel 
category:
 - laravel
---

### model层的多对多关系

表结构
要定义这种关联，需要三个数据库表： users，roles 和 role_user。role_user 表的命名是由关联的两个模型按照字母顺序来的，并且包含了 user_id 和 role_id 字段：

```
users
id - integer
name - string

roles
id - integer
name - string

role_user
user_id - integer
role_id - integer
```
模型结构
多对多关联通过调用 belongsToMany 这个内部方法返回的结果来定义，例如，我们在 User 模型中定义 roles 方法：
```
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    /**
     * 用户拥有的角色
     */
    public function roles()
    {
        return $this->belongsToMany('App\Models\Role');
    }
}
```
一旦关联关系被定义后，你可以通过 roles「动态属性」获取用户角色：
```
$user = App\Models\User::find(1);

foreach ($user->roles as $role) {
    //
}
```
当然，像其它所有关联模型一样，你可以使用 roles 方法，利用链式调用对查询语句添加约束条件：
```
$roles = App\Models\User::find(1)->roles()->orderBy('name')->get();
```
正如前面所提到的，为了确定关联连接表的表名，Eloquent 会按照字母顺序连接两个关联模型的名字。当然，你也可以不使用这种约定，传递第二个参数到 belongsToMany 方法即可：
```
return $this->belongsToMany('App\Models\Role', 'role_user');
```
除了自定义连接表的表名，你还可以通过传递额外的参数到 belongsToMany 方法来定义该表中字段的键名。第三个参数是定义此关联的模型在连接表里的外键名，第四个参数是另一个模型在连接表里的外键名：
```
return $this->belongsToMany('App\Models\Role', 'role_user', 'user_id', 'role_id');
```
定义反向关联
要定义多对多的反向关联， 你只需要在关联模型中调用 belongsToMany 方法。我们在 Role 模型中定义 users 方法：
```
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    /**
     * 拥有此角色的用户
     */
    public function users()
    {
        return $this->belongsToMany('App\Models\User');
    }
}
```
如你所见，除了引入模型为 App\Models\User 外，其它与在 User 模型中定义的完全一样。由于我们重用了 belongsToMany 方法，自定义连接表表名和自定义连接表里的键的字段名称在这里同样适用。

获取中间表字段
就如你刚才所了解的一样，多对多的关联关系需要一个中间表来提供支持， Eloquent 提供了一些有用的方法来和这张表进行交互。例如，假设我们的 User 对象关联了多个 Role 对象。在获得这些关联对象后，可以使用模型的 pivot 属性访问中间表的属性：
```
$user = App\Models\User::find(1);

foreach ($user->roles as $role) {
    echo $role->pivot->created_at;
}
```
需要注意的是，我们获取的每个 Role 模型对象，都会被自动赋予 pivot 属性，它代表中间表的一个模型对象，并且可以像其他的 Eloquent 模型一样使用。

默认情况下，pivot 对象只包含两个关联模型的主键，如果你的中间表里还有其他额外字段，你必须在定义关联时明确指出：
```
return $this->belongsToMany('App\Models\Role')->withPivot('column1', 'column2');
```
如果你想让中间表自动维护 created_at 和 updated_at 时间戳，那么在定义关联时附加上 withTimestamps 方法即可：
```
return $this->belongsToMany('App\Models\Role')->withTimestamps();
```
注意：在数据透视表上使用时间戳时，该表必须同时具有 created_at 和 updated_at 时间戳字段。

自定义 pivot 属性名称
如前所述，来自中间表的属性可以使用 pivot 属性访问。但是，你可以自由定制此属性的名称，以便更好的反应其在应用中的用途。

例如，如果你的应用中包含可能订阅的用户，则用户与博客之间可能存在多对多的关系。如果是这种情况，你可能希望将中间表访问器命名为 subscription 取代 pivot。这可以在定义关系时使用 as 方法完成：
```
return $this->belongsToMany('App\Models\Podcast')
                ->as('subscription')
                ->withTimestamps();
```
一旦定义完成，你可以使用自定义名称访问中间表数据：
```
$users = User::with('podcasts')->get();

foreach ($users->flatMap->podcasts as $podcast) {
    echo $podcast->subscription->created_at;
}
```
通过中间表过滤关系
在定义关系时，你还可以使用 wherePivot 和 wherePivotIn 方法来过滤 belongsToMany 返回的结果：
```
return $this->belongsToMany('App\Models\Role')->wherePivot('approved', 1);

return $this->belongsToMany('App\Models\Role')->wherePivotIn('priority', [1, 2]);

return $this->belongsToMany('App\Models\Role')->wherePivotNotIn('priority', [1, 2]);
```
定义中间表模型
如果你想定义一个自定义模型来表示关联关系中的中间表，可以在定义关联时调用 using 方法。自定义多对多中间表模型都必须扩展自 Illuminate\Database\Eloquent\Relations\Pivot 类，自定义多对多（多态）中间表模型必须继承 Illuminate\Database\Eloquent\Relations\MorphPivot 类。例如，我们在写 Role 模型的关联时，使用自定义中间表模型 RoleUser：
```
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    /**
     * 拥有此角色的所有用户
     */
    public function users()
    {
        return $this->belongsToMany('App\Models\User')->using('App\Models\RoleUser');
    }
}
```
当定义 RoleUser 模型时，我们要扩展 Pivot 类：
```
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class RoleUser extends Pivot
{
    //
}
```
你可以组合使用 using 和 withPivot 从中间表来检索列。例如，通过将列名传递给 withPivot 方法，就可以从 UserRole 中间表中检索出 created_by 和 updated_by 两列数据：
```
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    /**
     * 拥有此角色的用户
     */
    public function users()
    {
        return $this->belongsToMany('App\Models\User')
                        ->using('App\Models\RoleUser')
                        ->withPivot([
                            'created_by',
                            'updated_by',
                        ]);
    }
}
```
注意: Pivot 模型可能不使用 SoftDeletes 特性。 如果您需要软删除数据关联记录，请考虑将您的数据关联模型转换为实际的 Eloquent 模型。

带有递增 ID 的自定义中继模型
如果你用一个自定义的中继模型定义了多对多的关系，而且这个中继模型拥有一个自增的主键，你应当确保这个自定义中继模型类中定义了一个 incrementing 属性其值为 true。

```
/**
 * 标识 ID 是否自增
 *
 * @var bool
 */
public $incrementing = true;
```

文章来源:
https://learnku.com/docs/laravel/8.x/eloquent-relationships/9407#000a62