/*
 * 
 * system.js
 * ========
 * Основные системные функции
 *
*/

function nav(url)
{
  loadPage(url, true);
};

function loadPage(url, ajax)
{
  var m = menu.get(),
      page;

  if (url == getCurrentPage() && ajax) return;

  m.success(function(a)
  {
    for (var i in a.items)
    {
      var b = a.items[i];

      if (b['url'] == url.split('/')[0])
      {
        if (b['menu'])
        {
          if (url.split('/')[1])
          {
            for (var n in b['menu'])
            {
              if (b['menu'][n]['url'] == url.split('/')[1])
              {
                page = b['url'] + '/' + b['menu'][n]['url'] + '.htm';
              };
            };
          }
          else
          {
            page = b['url'] + '/' + b['url'] + '.htm';
          };
        }
        else if (!url.split('/')[1])
        {
          page = b['url'] + '.htm';
        };
      };
    };

    if (url == '') page = 'main.htm';

    if (!page)
    {
      loadErrorPage();

      return;
    };

    $('.content').load(TEXT_URL + page, function()
    {
      if (ajax) history.pushState(null, null, url);

      menu.generate.second();
      
      loadScripts();
      
      parser.init();
      elements.init();
    });
  });
};

function loadErrorPage()
{
  $('.content').load(TEXT_URL + 'error.htm', function()
  {    
    parser.convertLinks();

    $('.menu .item').each(function()
    {
      $(this).removeClass('active')
    });

    $('title').text('Ошибка | ' + config['siteName']);
  });
};

function loadScripts()
{
  var m = menu.get();

  m.success(function(a)
  {
    for (var i in a.items)
    {
      var b = a.items[i];

      if (b['url'] == getCurrentPage().split('/')[0] && b['scripts'])
      {
        for (var n in b['scripts'])
        {
          $.getScript(JS_URL + b['scripts'][n]);
        };
      };
    };
  });
};