package formfiller;

import java.io.IOException;
import java.util.EnumMap;
import java.util.LinkedHashMap;
import java.util.Map;

import models.Situation;
import models.Situation.Individu;
import models.Situation.IndividuRole;
import models.Situation.Logement;
import models.Situation.Nationalite;
import models.Situation.StatutMarital;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.edit.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.joda.time.LocalDate;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

public class AspaFormFiller extends FormFiller {

    private static final PDFont FONT = PDType1Font.TIMES_ROMAN;
    private static final EnumMap<StatutMarital, Point> statutMaritalCheckboxes = new EnumMap<>(StatutMarital.class);
    private static DateTimeFormatter monthFormatter;

    private final Situation situation;
    private int currentPage = 0;

    public AspaFormFiller(PDDocument document, Situation situation) {
        super(document);
        this.situation = situation;
        initStatutMaritalCheckboxesCoordinates();
        monthFormatter = DateTimeFormat.forPattern("MMMM yyyy");
    }

    private static void initStatutMaritalCheckboxesCoordinates() {
        statutMaritalCheckboxes.put(StatutMarital.SEUL, new Point(75, 475));
        statutMaritalCheckboxes.put(StatutMarital.MARIAGE, new Point(144, 475));
        statutMaritalCheckboxes.put(StatutMarital.PACS, new Point(388, 435));
        statutMaritalCheckboxes.put(StatutMarital.RELATION_LIBRE, new Point(228, 435));
    }

    @Override
    public void fill() {
        for (Individu individu : situation.individus) {
            if (IndividuRole.DEMANDEUR == individu.role) {
                fillDemandeur(individu);
            } else if (IndividuRole.CONJOINT == individu.role) {
                fillConjoint(individu);
            }
        }
        fillLogement(situation.logement);
        fillMonthsLabels();
        fillCurrentDate();
    }

    private void fillDemandeur(Individu demandeur) {
        currentPage = 4;
        appendText(demandeur.lastName, 140, 715);
        appendText(demandeur.firstName, 225, 655);
        appendDate(demandeur.dateDeNaissance, 140, 634);
        if (Nationalite.FRANCAISE == demandeur.nationalite) {
            appendText("française", 390, 635);
        }
        appendText("FRANCE", 470, 545);
        appendNumber(demandeur.numeroSecu.substring(0, 13), 155, 523);
        appendNumber(demandeur.numeroSecu.substring(13, 15), 323, 523);
        Point statutMaritalCheckbox = statutMaritalCheckboxes.get(statutMarital());
        checkbox(statutMaritalCheckbox.x, statutMaritalCheckbox.y);
    }

    private void fillConjoint(Individu conjoint) {
        currentPage = 4;
        appendText(conjoint.lastName, 140, 367);
        appendText(conjoint.firstName, 220, 347);
        appendDate(conjoint.dateDeNaissance, 129, 325);
        if (Nationalite.FRANCAISE == conjoint.nationalite) {
            appendText("française", 380, 327);
        }
        appendNumber(conjoint.numeroSecu.substring(0, 13), 150, 275);
        appendNumber(conjoint.numeroSecu.substring(13, 15), 318, 275);
    }

    private void fillLogement(Logement logement) {
        appendText(logement.adresse, 100, 565);
        appendNumber(logement.codePostal, 91, 543);
        appendText(logement.ville, 210, 545);
    }

    private StatutMarital statutMarital() {
        for (Individu individu : situation.individus) {
            if (IndividuRole.CONJOINT == individu.role) {
                return individu.statusMarital;
            }
        }

        return StatutMarital.SEUL;
    }

    private void fillMonthsLabels() {
        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
        Map<LocalDate, Point> months = new LinkedHashMap<>();
        months.put(currentMonth.minusMonths(3), new Point(320, 675));
        months.put(currentMonth.minusMonths(2), new Point(405, 675));
        months.put(currentMonth.minusMonths(1), new Point(490, 675));
        currentPage = 5;
        for (Map.Entry<LocalDate, Point> entry : months.entrySet()) {
            appendText(entry.getKey().toString(monthFormatter), entry.getValue().x, entry.getValue().y, 9);
        }
        currentPage = 6;
        for (Map.Entry<LocalDate, Point> entry : months.entrySet()) {
            appendText(entry.getKey().toString(monthFormatter), entry.getValue().x, entry.getValue().y, 9);
        }
    }

    private void fillCurrentDate() {
        currentPage = 7;
        String currentDate = LocalDate.now().toString("ddMMyyyy");
        appendNumber(currentDate, 198, 141);
    }

    private void appendText(String text, float x, float y, float fontSize) {
        PDPage page = (PDPage) document.getDocumentCatalog().getAllPages().get(currentPage);
        PDPageContentStream contentStream;
        try {
            contentStream = new PDPageContentStream(document, page, true, true);
            contentStream.beginText();
            contentStream.setFont(FONT, fontSize);
            contentStream.moveTextPositionByAmount(x, y);
            contentStream.drawString(text.toUpperCase());
            contentStream.endText();
            contentStream.close();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private void appendText(String text, float x, float y) {
        appendText(text, x, y, 12);
    }

    private void appendNumber(String number, float x, float y) {
        for (int i = 0; i < number.length(); i++) {
            appendText(number.substring(i, i+1), x + i*12, y);
        }
    }

    private void appendDate(String date, float x, float y) {
        appendNumber(date.replaceAll("/", ""), x, y);
    }

    private void checkbox(float x, float y) {
        appendText("x", x, y);
    }

    private static class Point {

        public float x;
        public float y;

        public Point(float x, float y) {
            this.x = x;
            this.y = y;
        }
    }
}
