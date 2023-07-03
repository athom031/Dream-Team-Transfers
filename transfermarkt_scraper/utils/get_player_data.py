from bs4 import BeautifulSoup

# td_player_tags[0] - #
"""
<td class="zentriert rueckennummer bg_Torwart" title="Goalkeeper">
    <div class="tm-shirt-number">
        12
    </div>
</td>
"""
def get_player_kit_number(col_tag):
    # find the div with class tm-shirt-number
    div = col_tag.find('div', class_='tm-shirt-number')

    # Extract the number
    kit_number_str = div.text.strip()

    # treat '-' as None
    kit_number = None if kit_number_str == '-' else int(kit_number_str)

    return kit_number

# td_player_tags[1] - Player
"""
<td class="posrela" title="">
    <span class="wechsel-kader-wappen hide-for-small">
        <a href="/west-ham-united/startseite/verein/379/saison_id/2022" title="Joined as a winter arrival from: West Ham United; date: Jan 26, 2023; fee: free transfer">
            <img alt="West Ham United" class="" src="https://tmssl.akamaized.net/images/wappen/kaderquad/379.png?lm=1464675260" title="West Ham United"/>
        </a>
    </span>

    <a class="hide-for-small" href="/west-ham-united/startseite/verein/379/saison_id/2022" title="Joined as a winter arrival from: West Ham United; date: Jan 26, 2023; fee: free transfer">
        <img class="wechsel-symbol" height="19px" src="/images/icons/winterzugang_beta_kader.png" width="19px"/>
    </a>

    <table class="inline-table" title="">
        <tr>
            <td class="" rowspan="2">
                <a href="#">
                    <img alt="Darren Randolph" class="bilderrahmen-fixed lazy lazy" data-src="https://img.a.transfermarkt.technology/portrait/small/51321-1667549274.jpg?lm=1" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" title="Darren Randolph"/>
                </a>
            </td>

            <td class="hauptlink">
                <div class="di nowrap">
                    <span class="hide-for-small">
                        <a
                            href="/darren-randolph/profil/spieler/51321" title="Darren Randolph">Darren Randolph
                        </a>
                    </span>
                </div>

                <div class="di nowrap">
                    <span class="show-for-small">
                        <a
                            href="/darren-randolph/profil/spieler/51321" title="Darren Randolph">D. Randolph
                        </a>
                    </span>
                </div>
            </td>
        </tr>

        <tr>
            <td>
                Goalkeeper
            </td>
        </tr>

    </table>

</td>
"""

# td_player_tags[2] - Date of birth / Age
"""
<td
    class="zentriert">May 12, 1987 (35)
</td>
"""

# td_player_tags[3] - Nationality
"""
<td class="zentriert">
    <img alt="Ireland" class="flaggenrahmen" src="https://tmssl.akamaized.net/images/flagge/verysmall/72.png?lm=1520611569" title="Ireland"/>

    <br/>

    <img alt="United States" class="flaggenrahmen" src="https://tmssl.akamaized.net/images/flagge/verysmall/184.png?lm=1520611569" title="United States"/>
</td>
"""

# td_player_tags[4] - Current Club
"""
<td class="zentriert">
    <a href="/afc-bournemouth/startseite/verein/989" title="AFC Bournemouth">
        <img alt="AFC Bournemouth" class="" src="https://tmssl.akamaized.net/images/wappen/verysmall/989.png?lm=1457991811" title="AFC Bournemouth"/>
    </a>
</td>
"""

# td_player_tags[5] - Market Value
"""
<td class="rechts hauptlink">
    <a
        href="/darren-randolph/marktwertverlauf/spieler/51321">€400k
    </a>

    <span
        class="icons_sprite red-arrow-ten" title="Previous market value: €500k">
    </span>
</td>
"""



def get_player_data(player_tag):
    td_player_tags = player_tag.find_all('td', recursive=False)

    tag_number_col = td_player_tags[0]
    tag_player_col = td_player_tags[1]
    tag_dob_age_col = td_player_tags[2]
    tag_nationality_col = td_player_tags[3]
    # ignore current club column (td_player_tags[4])
    tag_market_value_col = td_player_tags[5]


    kit_number = get_player_kit_number(tag_number_col)


    return [get_player_kit_number(tag_number_col)]
