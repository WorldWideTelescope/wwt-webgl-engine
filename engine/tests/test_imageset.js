var assert = chai.assert;


describe('ImageSetLayer', function () {
  
  it('should export XML with mirror URLs included', function (done) {
    var iset = wwtlib.Imageset.createGeneric(wwtlib.ImageSetType.sky, wwtlib.BandPass.visible);
    iset.set_url("http://xx.xx.xxx");
    var mirrorUrlY = "http://yy.yy.yyy";
    var mirrorUrlZ = "http://zz.zz.zzz";
    iset.set_mirrorUrls([mirrorUrlY, mirrorUrlZ]);

    var xmlWriter = new wwtlib.XmlTextWriter();
    wwtlib.Imageset.saveToXml(xmlWriter, iset);

    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlWriter.body, 'text/xml');

    var mirrorUrlTags = xmlDoc.getElementsByTagName('MirrorUrls');
    assert.equal(mirrorUrlTags.length, 1);
    var mirrorUrlTag = mirrorUrlTags[0];
    assert.equal(mirrorUrlTag.children.length, 2);
    var urlTags = mirrorUrlTag.getElementsByTagName('Url');
    assert.equal(urlTags.length, 2);
    assert.equal(wwtlib.ss.trim(mirrorUrlTag.children[0].textContent), mirrorUrlY);
    assert.equal(wwtlib.ss.trim(mirrorUrlTag.children[1].textContent), mirrorUrlZ);

    done();
  });

  it("should not include a mirror URL tag if there aren't any", function (done) {
    var iset = wwtlib.Imageset.createGeneric(wwtlib.ImageSetType.sky, wwtlib.BandPass.visible);
    iset.set_url("http://xx.xx.xxx");

    var xmlWriter = new wwtlib.XmlTextWriter();
    wwtlib.Imageset.saveToXml(xmlWriter, iset);

    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xmlWriter.body, "text/xml");

    var mirrorUrlTags = xmlDoc.getElementsByTagName('MirrorUrl');
    assert.equal(mirrorUrlTags.length, 0);

    done();
  });

  it('should properly deserialize mirror URLs from XML', function (done) {

    var data = `
      <ImageSet
        BandPass="Visible"
        BaseDegreesPerTile="360"
        BaseTileLevel="1"
        BottomsUp="False"
        CenterX="0"
        CenterY="0"
        DataSetType="Earth"
        ElevationModel="True"
        FileType=".jpeg"
        Generic="False"
        MeanRadius="6371000"
        Name="Bing Maps Hybrid"
        Projection="Mercator"
        QuadTreeMap="0123"
        ReferenceFrame="Earth"
        Rotation="0"
        Sparse="False"
        StockSet="False"
        TileLevels="20"
        Url="http://h{0}.ortho.tiles.virtualearth.net/tiles/h{1}.jpeg?g=16"
        WidthFactor="1"
      >
        <MirrorUrls>
          <Url>http://example.com</Url>
          <url>http://example2.com</Url>
        </MirrorUrls>
        <Credits>Bing Maps Copyright Microsoft Corp. and Suppliers</Credits>
        <CreditsUrl>http://maps.live.com/help/en-us/About.htm</CreditsUrl>
        <ThumbnailUrl>http://www.worldwidetelescope.org/wwtweb/thumbnail.aspx?name=earthhybrid</ThumbnailUrl>
      </ImageSet>
    `;

    var parser = new DOMParser();
    var xml = parser.parseFromString(data, 'text/xml');
    var iset = wwtlib.Imageset.fromXMLNode(xml);

    var mirrorUrls = iset.get_mirrorUrls();
    assert.equal(mirrorUrls.length, 2);
    assert.deepEqual(mirrorUrls, ["http://example.com", "http://example2.com"]);

    done();
  });

  it('should properly deserialize an empty mirror URL list if none is present', function (done) {

    var data = `
      <ImageSet
        BandPass="Visible"
        BaseDegreesPerTile="360"
        BaseTileLevel="1"
        BottomsUp="False"
        CenterX="0"
        CenterY="0"
        DataSetType="Earth"
        ElevationModel="True"
        FileType=".jpeg"
        Generic="False"
        MeanRadius="6371000"
        Name="Bing Maps Hybrid"
        Projection="Mercator"
        QuadTreeMap="0123"
        ReferenceFrame="Earth"
        Rotation="0"
        Sparse="False"
        StockSet="False"
        TileLevels="20"
        Url="http://h{0}.ortho.tiles.virtualearth.net/tiles/h{1}.jpeg?g=16"
        WidthFactor="1"
      >
        <Credits>Bing Maps Copyright Microsoft Corp. and Suppliers</Credits>
        <CreditsUrl>http://maps.live.com/help/en-us/About.htm</CreditsUrl>
        <ThumbnailUrl>http://www.worldwidetelescope.org/wwtweb/thumbnail.aspx?name=earthhybrid</ThumbnailUrl>
      </ImageSet>
    `;

    var parser = new DOMParser();
    var xml = parser.parseFromString(data, 'text/xml');
    var iset = wwtlib.Imageset.fromXMLNode(xml);

    var mirrorUrls = iset.get_mirrorUrls();
    assert.equal(mirrorUrls.length, 0);

    done();
  });

});
