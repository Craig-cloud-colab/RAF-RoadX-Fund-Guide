import 'package:flutter/material.dart';

void main() {
  runApp(const RafRoadXApp());
}

enum AppStep {
  entry,
  eligibility,
  claimPath,
  attorneyInfo,
  directInfo,
  documents,
  damages,
  calculator,
  summary,
  flowchart,
}

class RafRoadXApp extends StatelessWidget {
  const RafRoadXApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'RAF RoadX & Fund Guide',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF1A7A4A)),
        useMaterial3: true,
      ),
      home: const GuideHomePage(),
    );
  }
}

class GuideHomePage extends StatefulWidget {
  const GuideHomePage({super.key});

  @override
  State<GuideHomePage> createState() => _GuideHomePageState();
}

class _GuideHomePageState extends State<GuideHomePage> {
  AppStep _step = AppStep.entry;
  bool _acceptedDisclaimer = false;

  bool? _motorVehicle;
  bool? _fault;
  String? _claimPath; // attorney | direct

  final Set<int> _checkedDocs = <int>{};

  final TextEditingController _monthlyIncomeController = TextEditingController();
  double _monthsOff = 0;
  double _futureYears = 0;
  double _contingency = 15;

  @override
  void dispose() {
    _monthlyIncomeController.dispose();
    super.dispose();
  }

  void _goTo(AppStep step) {
    setState(() {
      _step = step;
    });
  }

  double get _monthlyIncome =>
      double.tryParse(_monthlyIncomeController.text.trim()) ?? 0;

  double get _pastLoss => _monthlyIncome * _monthsOff;

  double get _futureLoss =>
      (_monthlyIncome * 12 * _futureYears) * (1 - _contingency / 100);

  double get _totalLoss => _pastLoss + _futureLoss;

  String _currency(double value) {
    final rounded = value.round();
    final chars = rounded.toString().split('').reversed.toList();
    final parts = <String>[];
    for (var i = 0; i < chars.length; i += 3) {
      final end = (i + 3 > chars.length) ? chars.length : i + 3;
      parts.add(chars.sublist(i, end).reversed.join());
    }
    return 'R ${parts.reversed.join(',')}';
  }

  double get _progress {
    switch (_step) {
      case AppStep.entry:
        return 0.1;
      case AppStep.eligibility:
        return 0.2;
      case AppStep.claimPath:
        return 0.3;
      case AppStep.attorneyInfo:
      case AppStep.directInfo:
        return 0.4;
      case AppStep.documents:
        return 0.55;
      case AppStep.damages:
        return 0.68;
      case AppStep.calculator:
        return 0.8;
      case AppStep.summary:
        return 0.9;
      case AppStep.flowchart:
        return 1.0;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('RAF RoadX & Fund Guide'),
        backgroundColor: const Color(0xFF1A7A4A),
        foregroundColor: Colors.white,
      ),
      body: Stack(
        children: [
          Column(
            children: [
              LinearProgressIndicator(
                value: _progress,
                minHeight: 7,
                color: const Color(0xFFC9A227),
                backgroundColor: const Color(0xFF1A7A4A).withValues(alpha: 0.2),
              ),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: _stepContent(),
                ),
              ),
            ],
          ),
          if (!_acceptedDisclaimer) _disclaimerOverlay(),
        ],
      ),
    );
  }

  Widget _disclaimerOverlay() {
    return Container(
      color: Colors.black54,
      alignment: Alignment.center,
      child: Card(
        margin: const EdgeInsets.all(20),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Important Disclaimer',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 12),
              _bullet('This application is an educational and guidance tool only.'),
              _bullet('It does NOT provide legal advice.'),
              _bullet('Users are encouraged to consult a qualified attorney.'),
              _bullet(
                'You may choose to lodge a claim directly with the Road Accident Fund or through an attorney.',
              ),
              _bullet('The developers accept no liability for reliance on this tool.'),
              const SizedBox(height: 14),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: () {
                    setState(() {
                      _acceptedDisclaimer = true;
                    });
                  },
                  child: const Text('I Understand & Accept'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _stepContent() {
    switch (_step) {
      case AppStep.entry:
        return _section(
          title: 'Welcome',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'This tool helps you understand RAF claims, eligibility, and possible compensation.',
              ),
              const SizedBox(height: 16),
              Align(
                alignment: Alignment.centerRight,
                child: FilledButton(
                  onPressed: () => _goTo(AppStep.eligibility),
                  child: const Text('Start'),
                ),
              ),
            ],
          ),
        );
      case AppStep.eligibility:
        return _eligibilityView();
      case AppStep.claimPath:
        return _claimPathView();
      case AppStep.attorneyInfo:
        return _infoView(
          title: 'Using an Attorney',
          lines: const [
            'An attorney can assist with evidence gathering, expert reports, and negotiations.',
            'Fees may be deducted from your compensation.',
          ],
          onBack: () => _goTo(AppStep.claimPath),
          onNext: () => _goTo(AppStep.documents),
        );
      case AppStep.directInfo:
        return _infoView(
          title: 'Direct Claim',
          lines: const [
            'You can submit your claim directly to RAF.',
            'You will be responsible for all documentation and follow-ups.',
          ],
          onBack: () => _goTo(AppStep.claimPath),
          onNext: () => _goTo(AppStep.documents),
        );
      case AppStep.documents:
        return _documentsView();
      case AppStep.damages:
        return _infoView(
          title: 'Types of Damages',
          lines: const [
            'Past Medical Expenses - costs already incurred',
            'Future Medical Expenses - covered via RAF Undertaking (Section 17(4A))',
            'Loss of Earnings (Past & Future)',
            'General Damages (Pain & Suffering - serious injuries only)',
          ],
          onBack: () => _goTo(AppStep.documents),
          onNext: () => _goTo(AppStep.calculator),
        );
      case AppStep.calculator:
        return _calculatorView();
      case AppStep.summary:
        return _summaryView();
      case AppStep.flowchart:
        return _flowchartView();
    }
  }

  Widget _eligibilityView() {
    return _section(
      title: 'Eligibility Check',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Did the injury arise from a motor vehicle accident?'),
          const SizedBox(height: 8),
          SegmentedButton<bool>(
            segments: const [
              ButtonSegment<bool>(value: true, label: Text('Yes')),
              ButtonSegment<bool>(value: false, label: Text('No')),
            ],
            selected: _motorVehicle == null ? <bool>{} : <bool>{_motorVehicle!},
            onSelectionChanged: (selection) {
              setState(() {
                _motorVehicle = selection.first;
              });
            },
          ),
          const SizedBox(height: 10),
          const Text('Was another driver at least partly at fault?'),
          const SizedBox(height: 8),
          SegmentedButton<bool>(
            segments: const [
              ButtonSegment<bool>(value: true, label: Text('Yes')),
              ButtonSegment<bool>(value: false, label: Text('No / Unsure')),
            ],
            selected: _fault == null ? <bool>{} : <bool>{_fault!},
            onSelectionChanged: (selection) {
              setState(() {
                _fault = selection.first;
              });
            },
          ),
          const SizedBox(height: 12),
          if (_motorVehicle == false)
            const Card(
              color: Color(0xFFFFEBEE),
              child: Padding(
                padding: EdgeInsets.all(12),
                child: Text(
                  'RAF claims generally require injury from a motor vehicle accident.',
                ),
              ),
            ),
          const SizedBox(height: 10),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              OutlinedButton(
                onPressed: () => _goTo(AppStep.entry),
                child: const Text('Back'),
              ),
              FilledButton(
                onPressed: () {
                  if (_motorVehicle == true) {
                    _goTo(AppStep.claimPath);
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Please complete eligibility first.')),
                    );
                  }
                },
                child: const Text('Continue'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _claimPathView() {
    return _section(
      title: 'How do you want to claim?',
      child: Column(
        children: [
          ListTile(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            tileColor: const Color(0xFFE8F5EE),
            title: const Text('Through an Attorney'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              setState(() => _claimPath = 'attorney');
              _goTo(AppStep.attorneyInfo);
            },
          ),
          const SizedBox(height: 12),
          ListTile(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            tileColor: const Color(0xFFE8F5EE),
            title: const Text('Directly with RAF'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {
              setState(() => _claimPath = 'direct');
              _goTo(AppStep.directInfo);
            },
          ),
          const SizedBox(height: 16),
          Align(
            alignment: Alignment.centerLeft,
            child: OutlinedButton(
              onPressed: () => _goTo(AppStep.eligibility),
              child: const Text('Back'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _documentsView() {
    const docs = <String>[
      'ID Document',
      'Accident Report (SAPS)',
      'Medical Records',
      'Hospital Bills',
      'Proof of Income',
      'RAF 1 Form',
      'RAF 4 (Serious Injury Assessment)',
    ];

    return _section(
      title: 'Required Documents',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (var i = 0; i < docs.length; i++)
            CheckboxListTile(
              contentPadding: EdgeInsets.zero,
              title: Text(docs[i]),
              value: _checkedDocs.contains(i),
              onChanged: (checked) {
                setState(() {
                  if (checked == true) {
                    _checkedDocs.add(i);
                  } else {
                    _checkedDocs.remove(i);
                  }
                });
              },
            ),
          Text('${_checkedDocs.length} / ${docs.length} gathered'),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              OutlinedButton(
                onPressed: () =>
                    _goTo(_claimPath == 'attorney' ? AppStep.attorneyInfo : AppStep.directInfo),
                child: const Text('Back'),
              ),
              FilledButton(
                onPressed: () => _goTo(AppStep.damages),
                child: const Text('Continue'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _calculatorView() {
    return _section(
      title: 'Loss of Earnings Calculator',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextField(
            controller: _monthlyIncomeController,
            keyboardType: TextInputType.number,
            decoration: const InputDecoration(
              labelText: 'Monthly Income',
              hintText: 'e.g. 15000',
              border: OutlineInputBorder(),
            ),
            onChanged: (_) => setState(() {}),
          ),
          const SizedBox(height: 16),
          Text('Months Off Work: ${_monthsOff.round()}'),
          Slider(
            value: _monthsOff,
            min: 0,
            max: 60,
            divisions: 60,
            label: _monthsOff.round().toString(),
            onChanged: (value) => setState(() => _monthsOff = value),
          ),
          const SizedBox(height: 8),
          Text('Years Affected: ${_futureYears.round()}'),
          Slider(
            value: _futureYears,
            min: 0,
            max: 40,
            divisions: 40,
            label: _futureYears.round().toString(),
            onChanged: (value) => setState(() => _futureYears = value),
          ),
          const SizedBox(height: 8),
          Text('Contingency %: ${_contingency.round()}%'),
          Slider(
            value: _contingency,
            min: 5,
            max: 50,
            divisions: 45,
            label: '${_contingency.round()}%',
            onChanged: (value) => setState(() => _contingency = value),
          ),
          const SizedBox(height: 12),
          Card(
            color: const Color(0xFFE8F5EE),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                children: [
                  _calcRow('Past Loss', _currency(_pastLoss)),
                  _calcRow('Future Loss', _currency(_futureLoss)),
                  const Divider(),
                  _calcRow('Total', _currency(_totalLoss), bold: true),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Actual claim values depend on expert reports and RAF assessment.',
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              OutlinedButton(
                onPressed: () => _goTo(AppStep.damages),
                child: const Text('Back'),
              ),
              FilledButton(
                onPressed: () => _goTo(AppStep.summary),
                child: const Text('Continue'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _summaryView() {
    return _section(
      title: 'Claim Summary',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _summaryTile('Claim Path', _claimPath == 'attorney' ? 'Through an Attorney' : 'Directly with RAF'),
          _summaryTile('Documents gathered', '${_checkedDocs.length} / 7'),
          _summaryTile('Estimated Past Loss', _currency(_pastLoss)),
          _summaryTile('Estimated Future Loss', _currency(_futureLoss)),
          _summaryTile('Estimated Total', _currency(_totalLoss), highlighted: true),
          const SizedBox(height: 8),
          const Text(
            'Estimated loss of earnings displayed. Actual claim values depend on expert reports and RAF assessment.',
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              OutlinedButton(
                onPressed: () => _goTo(AppStep.calculator),
                child: const Text('Back'),
              ),
              FilledButton(
                onPressed: () => _goTo(AppStep.flowchart),
                child: const Text('View Process'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _flowchartView() {
    const processSteps = <String>[
      'Accident Occurs',
      'Medical Treatment',
      'Gather Documents',
      'Submit RAF Claim',
      'RAF Investigation',
      'Medical Assessments',
      'Settlement / Court',
      'Payment / Undertaking Issued',
    ];

    return _section(
      title: 'RAF Process Overview',
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (var i = 0; i < processSteps.length; i++) ...[
            Card(
              color: i == processSteps.length - 1
                  ? const Color(0xFF1A7A4A)
                  : const Color(0xFFE8F5EE),
              child: ListTile(
                title: Text(
                  processSteps[i],
                  style: TextStyle(
                    color: i == processSteps.length - 1 ? Colors.white : Colors.black87,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ),
            if (i < processSteps.length - 1)
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 2),
                child: Center(child: Icon(Icons.arrow_downward, size: 18)),
              ),
          ],
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              OutlinedButton(
                onPressed: () => _goTo(AppStep.summary),
                child: const Text('Back'),
              ),
              FilledButton(
                onPressed: _startOver,
                child: const Text('Start Over'),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _infoView({
    required String title,
    required List<String> lines,
    required VoidCallback onBack,
    required VoidCallback onNext,
  }) {
    return _section(
      title: title,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          ...lines.map(_bullet),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              OutlinedButton(onPressed: onBack, child: const Text('Back')),
              FilledButton(onPressed: onNext, child: const Text('Continue')),
            ],
          ),
        ],
      ),
    );
  }

  Widget _section({required String title, required Widget child}) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 12),
            child,
          ],
        ),
      ),
    );
  }

  Widget _bullet(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(top: 2, right: 8),
            child: Icon(Icons.check_circle, size: 18, color: Color(0xFF1A7A4A)),
          ),
          Expanded(child: Text(text)),
        ],
      ),
    );
  }

  Widget _summaryTile(String label, String value, {bool highlighted = false}) {
    return Card(
      color: highlighted ? const Color(0xFF1A7A4A) : const Color(0xFFF1F5F3),
      child: ListTile(
        title: Text(
          label,
          style: TextStyle(
            color: highlighted ? Colors.white70 : Colors.black54,
            fontSize: 13,
          ),
        ),
        subtitle: Text(
          value,
          style: TextStyle(
            color: highlighted ? Colors.white : Colors.black,
            fontSize: highlighted ? 22 : 17,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
    );
  }

  Widget _calcRow(String key, String value, {bool bold = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(key, style: TextStyle(fontWeight: bold ? FontWeight.w700 : FontWeight.w500)),
          Text(value, style: TextStyle(fontWeight: bold ? FontWeight.w700 : FontWeight.w500)),
        ],
      ),
    );
  }

  void _startOver() {
    setState(() {
      _step = AppStep.entry;
      _motorVehicle = null;
      _fault = null;
      _claimPath = null;
      _checkedDocs.clear();
      _monthlyIncomeController.clear();
      _monthsOff = 0;
      _futureYears = 0;
      _contingency = 15;
    });
  }
}
