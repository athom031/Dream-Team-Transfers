from datetime import datetime
# project defined imports
from transfermarkt_scraper.constants.webpage_tags import (
    A,
    IMG,
    DIV,
    SRC,
    TD,
    TITLE,
    WEBPAGE_PLAYER_IS_LOAN_IMG,
    WEBPAGE_PLAYER_KIT_NUMBER,
    WEBPAGE_PLAYER_LOAN_INFO_CLASS,
    WEBPAGE_PLAYER_NULL_KIT
)

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
    div = col_tag.find(DIV, class_=WEBPAGE_PLAYER_KIT_NUMBER)

    # Extract the number
    kit_number_text = div.text.strip()

    # treat '-' as None
    kit_number = None if kit_number_text == WEBPAGE_PLAYER_NULL_KIT else int(kit_number_text)

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
def check_if_loan_player(col_tag):
    loan_info = col_tag.find(A, class_=WEBPAGE_PLAYER_LOAN_INFO_CLASS)

    if loan_info is not None:
        # check img tag for src link matches loan link
        img_tag = loan_info.find(IMG)
        return (img_tag and img_tag.get(SRC) == WEBPAGE_PLAYER_IS_LOAN_IMG)
    else:
        return False

# td_player_tags[2] - Date of birth / Age
"""
<td
    class="zentriert">May 12, 1987 (35)
</td>
"""
def get_birth_date(col_tag):
    # get just string stored in td field
    td_text = col_tag.text.strip()

    # split text to just get birthday
    birthday, age = td_text.split(' (')

    # convert birthday string to a datetime object
    birth_date = datetime.strptime(birthday, '%b %d, %Y')

    return birth_date

# td_player_tags[3] - Nationality
"""
<td class="zentriert">
    <img alt="Ireland" class="flaggenrahmen" src="https://tmssl.akamaized.net/images/flagge/verysmall/72.png?lm=1520611569" title="Ireland"/>

    <br/>

    <img alt="United States" class="flaggenrahmen" src="https://tmssl.akamaized.net/images/flagge/verysmall/184.png?lm=1520611569" title="United States"/>
</td>
"""
def get_nationality(col_tag):
    # get first img that shows in this column
    img_tag = col_tag.find(IMG)

    # parse img for nation name and flag url
    (nationality, flag_url) = (img_tag[TITLE], img_tag[SRC])

    return (nationality, flag_url)

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
def get_player_market_value(col_tag):
    # get the a tag which holds market value
    a_tag = col_tag.find(A)

    if(a_tag is None):
        return 0

    # get the text within <a> tag
    market_value_text = a_tag.text.strip()

    # remove '€' from market value text and 'k' or 'm' suffix
    market_value_numeric_text = market_value_text[1:-1]

    # add context of if value was in thousand or million euros
    multiplier = 1_000_000 if market_value_text.endswith('m') else 1_000

    # calculate market value in euros
    market_value = float(market_value_numeric_text) * multiplier

    return market_value


def get_player_data(player_tag):
    td_player_tags = player_tag.find_all(TD, recursive=False)
    # conditions on which player is not valid: either 0 market value or a loan player to be returned back to original club for 23/24
    tag_number_col = td_player_tags[0]
    tag_player_col = td_player_tags[1]
    tag_dob_age_col = td_player_tags[2]
    tag_nationality_col = td_player_tags[3]
    # ignore current club column (td_player_tags[4])
    tag_market_value_col = td_player_tags[5]

    market_value = get_player_market_value(tag_market_value_col)
    is_loan_player = check_if_loan_player(tag_player_col)

    # only get player_data if valid supported player for this team
    if(market_value <= 0 or is_loan_player):
        return None
    else:
        # get player kit number if available
        kit_number = get_player_kit_number(tag_number_col)
        birth_date = get_birth_date(tag_dob_age_col)
        (nationality, flag_url) = get_nationality(tag_nationality_col)

        print (kit_number, nationality, market_value, birth_date, flag_url)
        return []

    # kit_number = get_player_kit_number(tag_number_col)


    # return [market_value]



# <td class="posrela" title=""><span class="wechsel-kader-wappen hide-for-small"><a href="/west-ham-united/startseite/verein/379/saison_id/2022" title="Joined as a winter arrival from: West Ham United; date: Jan 26, 2023; fee: free transfer"><img alt="West Ham United" class="" src="https://tmssl.akamaized.net/images/wappen/kaderquad/379.png?lm=1464675260" title="West Ham United"/></a></span><a class="hide-for-small" href="/west-ham-united/startseite/verein/379/saison_id/2022" title="Joined as a winter arrival from: West Ham United; date: Jan 26, 2023; fee: free transfer"><img class="wechsel-symbol" height="19px" src="/images/icons/winterzugang_beta_kader.png" width="19px"/></a><table class="inline-table" title=""><tr><td class="" rowspan="2"><a href="#"><img alt="Darren Randolph" class="bilderrahmen-fixed lazy lazy" data-src="https://img.a.transfermarkt.technology/portrait/small/51321-1667549274.jpg?lm=1" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" title="Darren Randolph"/></a></td><td class="hauptlink"><div class="di nowrap"><span class="hide-for-small"><a href="/darren-randolph/profil/spieler/51321" title="Darren Randolph">Darren Randolph</a></span></div><div class="di nowrap"><span class="show-for-small"><a href="/darren-randolph/profil/spieler/51321" title="Darren Randolph">D. Randolph</a></span></div></td></tr><tr><td>Goalkeeper</td></tr></table></td>
# unsupported player detected

# <td class="posrela" title=""><span class="wechsel-kader-wappen hide-for-small"><a href="/dynamo-kyiv/startseite/verein/338/saison_id/2022" title="Joined as a winter arrival from: Dynamo Kyiv; date: Jan 31, 2023; fee: €22.70m"><img alt="Dynamo Kyiv" class="" src="https://tmssl.akamaized.net/images/wappen/kaderquad/338.png?lm=1442954715" title="Dynamo Kyiv"/></a></span><a class="hide-for-small" href="/dynamo-kyiv/startseite/verein/338/saison_id/2022" title="Joined as a winter arrival from: Dynamo Kyiv; date: Jan 31, 2023; fee: €22.70m"><img class="wechsel-symbol" height="19px" src="/images/icons/winterzugang_beta_kader.png" width="19px"/></a><table class="inline-table" title=""><tr><td class="" rowspan="2"><a href="#"><img alt="Ilya Zabarnyi" class="bilderrahmen-fixed lazy lazy" data-src="https://img.a.transfermarkt.technology/portrait/small/659089-1665387692.png?lm=1" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" title="Ilya Zabarnyi"/></a></td><td class="hauptlink"><div class="di nowrap"><span class="hide-for-small"><a href="/ilya-zabarnyi/profil/spieler/659089" title="Ilya Zabarnyi">Ilya Zabarnyi</a></span></div><div class="di nowrap"><span class="show-for-small"><a href="/ilya-zabarnyi/profil/spieler/659089" title="Ilya Zabarnyi">I. Zabarnyi</a></span></div></td></tr><tr><td>Centre-Back</td></tr></table></td>
# unsupported player detected

# <td class="posrela" title=""><table class="inline-table" title=""><tr><td class="" rowspan="2"><a href="#"><img alt="Owen Bevan" class="bilderrahmen-fixed lazy lazy" data-src="https://img.a.transfermarkt.technology/portrait/small/default.jpg?lm=1" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" title="Owen Bevan"/></a></td><td class="hauptlink"><div class="di nowrap"><span class="hide-for-small"><a href="/owen-bevan/profil/spieler/583990" title="Owen Bevan">Owen Bevan</a></span></div><div class="di nowrap"><span class="show-for-small"><a href="/owen-bevan/profil/spieler/583990" title="Owen Bevan">O. Bevan</a></span></div></td></tr><tr><td>Centre-Back</td></tr></table></td>
# unsupported player detected

# <td class="posrela" title=""><table class="inline-table" title=""><tr><td class="" rowspan="2"><a href="#"><img alt="Chris Francis" class="bilderrahmen-fixed lazy lazy" data-src="https://img.a.transfermarkt.technology/portrait/small/default.jpg?lm=1" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" title="Chris Francis"/></a></td><td class="hauptlink"><div class="di nowrap"><span class="hide-for-small"><a href="/chris-francis/profil/spieler/855087" title="Chris Francis">Chris Francis</a></span></div><div class="di nowrap"><span class="show-for-small"><a href="/chris-francis/profil/spieler/855087" title="Chris Francis">C. Francis</a></span></div></td></tr><tr><td>Centre-Back</td></tr></table></td>
# unsupported player detected

# <td class="posrela" title=""><table class="inline-table" title=""><tr><td class="" rowspan="2"><a href="#"><img alt="Maxwell Kinsey-Wellings" class="bilderrahmen-fixed lazy lazy" data-src="https://img.a.transfermarkt.technology/portrait/small/default.jpg?lm=1" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" title="Maxwell Kinsey-Wellings"/></a></td><td class="hauptlink"><div class="di nowrap"><span class="hide-for-small"><a href="/maxwell-kinsey-wellings/profil/spieler/939615" title="Maxwell Kinsey-Wellings">Maxwell Kinsey-Wellings</a></span></div><div class="di nowrap"><span class="show-for-small"><a href="/maxwell-kinsey-wellings/profil/spieler/939615" title="Maxwell Kinsey-Wellings">M. Kinsey-Wellings</a></span></div></td></tr><tr><td>Centre-Back</td></tr></table></td>
# unsupported player detected

# <td class="posrela" title=""><table class="inline-table" title=""><tr><td class="" rowspan="2"><a href="#"><img alt="Ferdinand Okoh" class="bilderrahmen-fixed lazy lazy" data-src="https://img.a.transfermarkt.technology/portrait/small/default.jpg?lm=1" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" title="Ferdinand Okoh"/></a></td><td class="hauptlink"><div class="di nowrap"><span class="hide-for-small"><a href="/ferdinand-okoh/profil/spieler/854708" title="Ferdinand Okoh">Ferdinand Okoh</a></span></div><div class="di nowrap"><span class="show-for-small"><a href="/ferdinand-okoh/profil/spieler/854708" title="Ferdinand Okoh">F. Okoh</a></span></div></td></tr><tr><td>Attacking Midfield</td></tr></table></td>
# unsupported player detected

# <td class="posrela" title=""><table class="inline-table" title=""><tr><td class="" rowspan="2"><a href="#"><img alt="Michael Dacosta" class="bilderrahmen-fixed lazy lazy" data-src="https://img.a.transfermarkt.technology/portrait/small/default.jpg?lm=1" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" title="Michael Dacosta"/></a></td><td class="hauptlink"><div class="di nowrap"><span class="hide-for-small"><a href="/michael-dacosta/profil/spieler/854722" title="Michael Dacosta">Michael Dacosta</a></span></div><div class="di nowrap"><span class="show-for-small"><a href="/michael-dacosta/profil/spieler/854722" title="Michael Dacosta">M. Dacosta</a></span></div></td></tr><tr><td>Left Winger</td></tr></table></td>
# unsupported player detected

# <td class="posrela" title=""><span class="wechsel-kader-wappen hide-for-small"><a href="/fc-lorient/startseite/verein/1158/saison_id/2022" title="Joined as a winter arrival from: FC Lorient; date: Jan 19, 2023; fee: €22.50m"><img alt="FC Lorient" class="" src="https://tmssl.akamaized.net/images/wappen/kaderquad/1158.png?lm=1406642498" title="FC Lorient"/></a></span><a class="hide-for-small" href="/fc-lorient/startseite/verein/1158/saison_id/2022" title="Joined as a winter arrival from: FC Lorient; date: Jan 19, 2023; fee: €22.50m"><img class="wechsel-symbol" height="19px" src="/images/icons/winterzugang_beta_kader.png" width="19px"/></a><table class="inline-table" title=""><tr><td class="" rowspan="2"><a href="#"><img alt="Dango Ouattara" class="bilderrahmen-fixed lazy lazy" data-src="https://img.a.transfermarkt.technology/portrait/small/823231-1663162842.jpg?lm=1" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" title="Dango Ouattara"/></a></td><td class="hauptlink"><div class="di nowrap"><span class="hide-for-small"><a href="/dango-ouattara/profil/spieler/823231" title="Dango Ouattara">Dango Ouattara</a></span></div><div class="di nowrap"><span class="show-for-small"><a href="/dango-ouattara/profil/spieler/823231" title="Dango Ouattara">D. Ouattara</a></span></div></td></tr><tr><td>Right Winger</td></tr></table></td>
# unsupported player detected

# <td class="posrela" title=""><span class="wechsel-kader-wappen hide-for-small"><a href="/bristol-city/startseite/verein/698/saison_id/2022" title="Joined as a winter arrival from: Bristol City; date: Jan 27, 2023; fee: €10.25m"><img alt="Bristol City" class="" src="https://tmssl.akamaized.net/images/wappen/kaderquad/698.png?lm=1571314125" title="Bristol City"/></a></span><a class="hide-for-small" href="/bristol-city/startseite/verein/698/saison_id/2022" title="Joined as a winter arrival from: Bristol City; date: Jan 27, 2023; fee: €10.25m"><img class="wechsel-symbol" height="19px" src="/images/icons/winterzugang_beta_kader.png" width="19px"/></a><table class="inline-table" title=""><tr><td class="" rowspan="2"><a href="#"><img alt="Antoine Semenyo" class="bilderrahmen-fixed lazy lazy" data-src="https://img.a.transfermarkt.technology/portrait/small/583255-1628669787.jpg?lm=1" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" title="Antoine Semenyo"/></a></td><td class="hauptlink"><div class="di nowrap"><span class="hide-for-small"><a href="/antoine-semenyo/profil/spieler/583255" title="Antoine Semenyo">Antoine Semenyo</a></span></div><div class="di nowrap"><span class="show-for-small"><a href="/antoine-semenyo/profil/spieler/583255" title="Antoine Semenyo">A. Semenyo</a></span></div></td></tr><tr><td>Centre-Forward</td></tr></table></td>
# unsupported player detected

# <td class="posrela" title=""><table class="inline-table" title=""><tr><td class="" rowspan="2"><a href="#"><img alt="Euan Pollock" class="bilderrahmen-fixed lazy lazy" data-src="https://img.a.transfermarkt.technology/portrait/small/default.jpg?lm=1" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" title="Euan Pollock"/></a></td><td class="hauptlink"><div class="di nowrap"><span class="hide-for-small"><a href="/euan-pollock/profil/spieler/655142" title="Euan Pollock">Euan Pollock</a></span></div><div class="di nowrap"><span class="show-for-small"><a href="/euan-pollock/profil/spieler/655142" title="Euan Pollock">E. Pollock</a></span></div></td></tr><tr><td>Centre-Forward</td></tr></table></td>
# unsupported player detected

# <td class="posrela" title=""><table class="inline-table" title=""><tr><td class="" rowspan="2"><a href="#"><img alt="Daniel Adu-Adjei" class="bilderrahmen-fixed lazy lazy" data-src="https://img.a.transfermarkt.technology/portrait/small/default.jpg?lm=1" src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" title="Daniel Adu-Adjei"/></a></td><td class="hauptlink"><div class="di nowrap"><span class="hide-for-small"><a href="/daniel-adu-adjei/profil/spieler/963878" title="Daniel Adu-Adjei">Daniel Adu-Adjei</a></span></div><div class="di nowrap"><span class="show-for-small"><a href="/daniel-adu-adjei/profil/spieler/963878" title="Daniel Adu-Adjei">D. Adu-Adjei</a></span></div></td></tr><tr><td>Centre-Forward</td></tr></table></td>
# unsupported player detected
